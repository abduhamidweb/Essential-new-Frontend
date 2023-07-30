import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { setAllContr, setAllBooks, setAllUnits } from "../../features/counter/counterSlice";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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

    async function getDataBooks() {
        try {
            let res = await axios.get(`http://localhost:5000/api/books`, { headers });
            dispatch(setAllBooks(res.data));
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }

    async function getDataUnits() {
        try {
            let res = await axios.get(`http://localhost:5000/api/units`, { headers });
            dispatch(setAllUnits(res.data));
        } catch (error) {
            console.error('Error fetching units:', error);
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/auth");
            return;
        }
        getDataBooks();
        getDataUnits();
    }, []);

    useEffect(() => {
        // Seçili birimler veya kitaplar değiştiğinde wordsCount'u güncelle
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
        // selectedBooks va selectedUnits o'zgarishlari bo'lganda localStorage ga saqlash
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
            let allController = {
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

    return (
        <>
            <div className="container">
                <div className="row">
                    <div>
                        <h2>Kitoblar</h2>
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        {books ? books.map(book => (
                            <li key={book._id}>
                                <h3>{book.bookname}</h3>
                                <input
                                    type="checkbox"
                                    checked={selectedBooks.includes(book._id)}
                                    onChange={event => handleBookCheckboxChange(event, book._id)}
                                />
                            </li>
                        )) : null}
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                        <h2>Unitlar</h2>
                        {units ? units
                            .filter(unit => selectedBooks.includes(unit.bookId))
                            .map(unit => (
                                <li key={unit._id}>
                                    <h3>{unit.unitname}</h3>
                                    <p>{unit.description}</p>
                                    <input
                                        type="checkbox"
                                        checked={selectedUnits.includes(unit._id)}
                                        onChange={event => handleUnitCheckboxChange(event, unit._id)}
                                    />
                                </li>
                            )) : null}
                    </div>
                </div>
                <div className="col-12">
                    <select onChange={(e) => {
                        setSort(e.target.value);
                    }}>
                        <option selected disabled>sort</option>
                        <option value={"random"}> random</option>
                        <option defaultValue={"uzb"} value={"uzb"}> Eng tu Uzb</option>
                        <option value={"eng"}> Uzb to Eng</option>
                    </select>
                </div>
                <div className="col-12">
                    <p>qancha soz bilan randomli o'yin o'ynaysiz. taxminan {count ? count : wordsCount} bilan o'ynamoqchimisiz. bu ko'pmasmi?</p>
                    <input type="range" max={wordsCount} maxLength={wordsCount} onChange={(e) => {
                        setCount(e.target.value);
                    }} />
                </div>
                <div className="col-12">
                    <button className="btn btn-info w-100 mt-3 p-3" onClick={() => handlerNavigate()}>play game</button>
                </div>
            </div>
        </>
    );
};

export default Controller;
