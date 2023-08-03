import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setAllContr, setAllBooks, setAllUnits } from "../../features/counter/counterSlice";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./index.scss"
const Controller = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const headers = {
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
    };

    const { books, units } = useSelector((state) => state.counter);
    const [selectedBooks, setSelectedBooks] = useState(() => {
        try {
            const storedBooks = localStorage.getItem('selectedBooks');
            return storedBooks ? JSON.parse(storedBooks) : [];
        } catch (error) {
            console.error('Error parsing selectedBooks from localStorage:', error);
            return [];
        }
    });
    const [selectedUnits, setSelectedUnits] = useState(() => {
        try {
            const storedUnits = localStorage.getItem('selectedUnits');
            return storedUnits ? JSON.parse(storedUnits) : [];
        } catch (error) {
            console.error('Error parsing selectedUnits from localStorage:', error);
            return [];
        }
    });
    const [wordsCount, setWordsCount] = useState(0);
    const [count, setCount] = useState(0);
    const [sort, setSort] = useState('random');

    // Data fetching functions
    const getData = async (url, action) => {
        try {
            const res = await axios.get(url, { headers });
            dispatch(action(res.data));
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/auth");
        } else {
            getData(`https://lugat.onrender.com/api/books`, setAllBooks);
            getData(`https://lugat.onrender.com/api/units`, setAllUnits);
        }
    }, [navigate]);

    useEffect(() => {
        // Update wordsCount when selected units or units data change
        let count = 0;
        selectedUnits.forEach(unitId => {
            const unit = units.find(unit => unit._id === unitId);
            if (unit) {
                count += unit.words.length;
            }
        });
        setWordsCount(count);
    }, [selectedUnits, units]);

    useEffect(() => {
        // Update localStorage when selectedBooks or selectedUnits change
        try {
            localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
            localStorage.setItem('selectedUnits', JSON.stringify(selectedUnits));
        } catch (error) {
            console.error('Error saving data to localStorage:', error);
        }
    }, [selectedBooks, selectedUnits]);

    const handleBookCheckboxChange = (event, bookId) => {
        if (event.target.checked) {
            setSelectedBooks(prevSelectedBooks => [...prevSelectedBooks, bookId]);
        } else {
            setSelectedBooks(prevSelectedBooks =>
                prevSelectedBooks.filter(id => id !== bookId)
            );
            setSelectedUnits(prevSelectedUnits =>
                prevSelectedUnits.filter(unitId =>
                    units.find(unit => unit._id === unitId).bookId !== bookId
                )
            );
        }
    };
    const handleUnitCheckboxChange = (event, unitId) => {
        if (event.target.checked) {
            setSelectedUnits(prevSelectedUnits => [...prevSelectedUnits, unitId]);
        } else {
            setSelectedUnits(prevSelectedUnits =>
                prevSelectedUnits.filter(id => id !== unitId)
            );
        }
    };

    const handlerNavigate = () => {
        if (selectedBooks.length && selectedUnits.length && (count || wordsCount) && sort) {
            const allController = {
                "booksId": selectedBooks,
                "unitsId": selectedUnits,
                "sort": sort,
                "wordCount": count ? Number(count) : Number(wordsCount)
            };

            dispatch(setAllContr(allController));
            navigate("/playgame");
        } else {
            console.error('Please select at least one book, one unit, and set word count.');
        }
    };
    const handlerNavigateWriting = () => {
        if (selectedBooks.length && selectedUnits.length && (count || wordsCount) && sort === 'eng') {
            const allController = {
                "booksId": selectedBooks,
                "unitsId": selectedUnits,
                "sort": sort,
                "wordCount": count ? Number(count) : Number(wordsCount)
            };

            dispatch(setAllContr(allController));
            navigate("/writing");
        } else {
            console.error('Please select at least one book, one unit, and set word count.');
        }
    };
    
    const handlerNavigateSpeaking = () => {
        if (selectedBooks.length && selectedUnits.length && (count || wordsCount) && sort === 'eng') {
            const allController = {
                "booksId": selectedBooks,
                "unitsId": selectedUnits,
                "sort": sort,
                "wordCount": count ? Number(count) : Number(wordsCount)
            };

            dispatch(setAllContr(allController));
            navigate("/speaking");
        } else {
            console.error('Please select at least one book, one unit, and set word count.');
        }
    };
    const groupedUnits = {};

    // "units" dizisini "bookId" değerine göre gruplama
    units.forEach(unit => {
        if (!groupedUnits[unit.bookId]) {
            groupedUnits[unit.bookId] = [];
        }
        groupedUnits[unit.bookId].push(unit);
    });
    return (
        <div className="container">
            <div className="row">
                <div className="col-12 border p-2 mt-2 d-flex">
                    <h2>Yo'nalishni tanlang!!</h2>
                    <div className="checkboxs">
                        <div className="custom-checkbox" onClick={() => setSort('random')}>
                            <input type="checkbox" checked={sort === 'random'} onChange={() => { }} />
                            <span className="checkmark"></span>
                            <label>random</label>
                        </div>
                        <div className="custom-checkbox" onClick={() => setSort('uzb')}>
                            <input type="checkbox" checked={sort === 'uzb'} onChange={() => { }} />
                            <span className="checkmark"></span>
                            <label>Eng tu Uzb</label>
                        </div>
                        <div className="custom-checkbox" onClick={() => setSort('eng')}>
                            <input type="checkbox" checked={sort === 'eng'} onChange={() => { }} />
                            <span className="checkmark"></span>
                            <label>Uzb to Eng</label>
                        </div>
                    </div>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 border p-2 mt-2 d-flex">
                    <ul>
                        <h2>Kitobni tanlang!!</h2>
                        {books.map(book => (
                            <li key={book._id} className="bookList">
                                <h3>{book.bookname}</h3>
                                <input
                                    type="checkbox"
                                    checked={selectedBooks.includes(book._id)}
                                    onChange={event => handleBookCheckboxChange(event, book._id)}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-lg-12 col-md-12 col-sm-12 border p-2 mt-2 ">

                    <ul>
                        <h2>Unitni tanlang!!</h2>
                        <div style={{ display: "flex" }}>
                            {selectedBooks.map(selectedBookId => {
                                const bookUnits = units.filter(unit => unit.bookId === selectedBookId);
                                return (
                                    <div key={selectedBookId} style={{ flex: 1 }}>
                                        <ul>
                                            {bookUnits.map(unit => (
                                                <li key={unit._id} className="bookList">
                                                    <h3>{unit.unitname}</h3>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUnits.includes(unit._id)}
                                                        onChange={event => handleUnitCheckboxChange(event, unit._id)}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    </ul>
                </div>
            </div>
            <div className="col-12 info border p-2 mt-3 ">
                <h4>Yo'nalish <strong>{sort}</strong>. Miqdori <strong>{count ? count : wordsCount}</strong>. Bu ko'pmasmi!!</h4>
                <input type="range" max={wordsCount} className="w-50" maxLength={wordsCount} onChange={(e) => setCount(e.target.value)} />
                <button className="btn btn-info w-100 mt-3 p-3" onClick={handlerNavigate}>play game</button>
                {
                    sort == "eng" ? <button className="btn btn-info w-100 mt-3 p-3" onClick={handlerNavigateWriting}  >writing</button> : <button className="btn btn-info w-100 mt-3 p-3" onClick={handlerNavigateWriting}  disabled>writing click uzb to eng yo'nalish</button>
                }
                {
                    sort == "eng" ? <button className="btn btn-info w-100 mt-3 p-3" onClick={handlerNavigateSpeaking}  >Speaking</button> : <button className="btn btn-info w-100 mt-3 p-3"  disabled>Speaking click uzb to eng yo'nalish</button>
                }
            </div>
        </div>
    );
};

export default Controller;
