import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const headers = {
        'Content-Type': 'application/json',
        'token': localStorage.getItem("admin-token")
    };
    const [books, setBooks] = useState([]);
    const [editingBookId, setEditingBookId] = useState(null);
    const [newBook, setNewBook] = useState({ bookname: '', description: '' });
    const [selectedBooks, setSelectedBooks] = useState(new Set()); // Store the IDs of selected books
    const [editingUnitId, setEditingUnitId] = useState(null); // Store the ID of the unit being edited
    const [editingWordId, setEditingWordId] = useState(null); // Store the ID of the word being edited

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/books', { headers });
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleEditBookName = async (bookId, newName) => {
        try {
            await axios.put(`http://localhost:5000/api/books/${bookId}`, { bookname: newName }, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => (book._id === bookId ? { ...book, bookname: newName } : book))
            );
            setEditingBookId(null);
        } catch (error) {
            console.error('Error updating book name:', error);
        }
    };

    const handleDeleteBook = async (bookId) => {
        try {
            await axios.delete(`http://localhost:5000/api/books/${bookId}`, { headers });
            setBooks((prevBooks) => prevBooks.filter((book) => book._id !== bookId));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const handleAddBook = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/books', newBook, { headers });
            setBooks((prevBooks) => [...prevBooks, response.data]);
            setNewBook({ bookname: '', description: '' });
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const handleBookCheckboxChange = (bookId) => {
        setSelectedBooks((prevSelectedBooks) => {
            const newSelectedBooks = new Set(prevSelectedBooks);
            if (prevSelectedBooks.has(bookId)) {
                newSelectedBooks.delete(bookId);
            } else {
                newSelectedBooks.add(bookId);
            }
            return newSelectedBooks;
        });
    };

    const handleEditUnitName = async (unitId, newName) => {
        try {
            await axios.put(`http://localhost:5000/api/units/${unitId}`, { unitname: newName }, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => ({
                    ...book,
                    units: book.units.map((unit) =>
                        unit._id === unitId ? { ...unit, unitname: newName } : unit
                    )
                }))
            );
            setEditingUnitId(null);
        } catch (error) {
            console.error('Error updating unit name:', error);
        }
    };

    const handleDeleteUnit = async (unitId) => {
        try {
            await axios.delete(`http://localhost:5000/api/units/${unitId}`, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => ({
                    ...book,
                    units: book.units.filter((unit) => unit._id !== unitId)
                }))
            );
        } catch (error) {
            console.error('Error deleting unit:', error);
        }
    };

    const handleAddUnit = async (bookId, unitName, unitDescription) => {
        try {
            const response = await axios.post('http://localhost:5000/api/units', {
                unitname: unitName,
                description: unitDescription,
                bookId: bookId
            }, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => {
                    if (book._id === bookId) {
                        return { ...book, units: [...book.units, response.data] };
                    }
                    return book;
                })
            );
        } catch (error) {
            console.error('Error adding unit:', error);
        }
    };

    const handleEditWord = async (wordId, newEngWord, newUzbWord) => {
        try {
            await axios.put(`http://localhost:5000/api/words/${wordId}`, {
                engWord: newEngWord,
                uzbWord: newUzbWord
            }, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => ({
                    ...book,
                    units: book.units.map((unit) => ({
                        ...unit,
                        words: unit.words.map((word) =>
                            word._id === wordId ? { ...word, engWord: newEngWord, uzbWord: newUzbWord } : word
                        )
                    }))
                }))
            );
            setEditingWordId(null);
        } catch (error) {
            console.error('Error updating word:', error);
        }
    };

    const handleDeleteWord = async (wordId) => {
        try {
            await axios.delete(`http://localhost:5000/api/words/${wordId}`, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => ({
                    ...book,
                    units: book.units.map((unit) => ({
                        ...unit,
                        words: unit.words.filter((word) => word._id !== wordId)
                    }))
                }))
            );
        } catch (error) {
            console.error('Error deleting word:', error);
        }
    };

    const handleAddWord = async (unitId, engWord, uzbWord) => {
        try {
            const response = await axios.post('http://localhost:5000/api/words', {
                engWord: engWord,
                uzbWord: uzbWord,
                unitId: unitId
            }, { headers });
            setBooks((prevBooks) =>
                prevBooks.map((book) => ({
                    ...book,
                    units: book.units.map((unit) => {
                        if (unit._id === unitId) {
                            return { ...unit, words: [...unit.words, response.data] };
                        }
                        return unit;
                    })
                }))
            );
        } catch (error) {
            console.error('Error adding word:', error);
        }
    };

    return (
        <div>
            <h1>Books List</h1>
            <div>
                <input
                    type="text"
                    placeholder="Book Name"
                    value={newBook.bookname}
                    onChange={(e) => setNewBook({ ...newBook, bookname: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Book Description"
                    value={newBook.description}
                    onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                />
                <button onClick={handleAddBook}>Add Book</button>
            </div>
            {books.map((book) => (
                <div key={book._id}>
                    <div>
                        <input
                            type="checkbox"
                            checked={selectedBooks.has(book._id)}
                            onChange={() => handleBookCheckboxChange(book._id)}
                        />
                        {editingBookId === book._id ? (
                            <div>
                                <input
                                    type="text"
                                    value={book.bookname}
                                    onChange={(e) => {
                                        setBooks((prevBooks) =>
                                            prevBooks.map((prevBook) =>
                                                prevBook._id === book._id ? { ...prevBook, bookname: e.target.value } : prevBook
                                            )
                                        );
                                    }}
                                    onBlur={() => {
                                        handleEditBookName(book._id, book.bookname);
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleEditBookName(book._id, book.bookname);
                                        }
                                    }}
                                />
                                <button onClick={() => handleEditBookName(book._id, book.bookname)}>Save</button>
                                <button onClick={() => setEditingBookId(null)}>Cancel</button>
                            </div>
                        ) : (
                            <div>
                                <span>{book.bookname}</span>
                                <span onClick={() => setEditingBookId(book._id)}>✏️</span>
                                <span onClick={() => handleDeleteBook(book._id)}>🗑️</span>
                            </div>
                        )}
                    </div>
                    {/* Render units for the selected book */}
                    {selectedBooks.has(book._id) && (
                        <div>
                            {book.units.map((unit) => (
                                <div key={unit._id}>
                                    <div>
                                        <input
                                            type="checkbox"
                                            checked={editingUnitId === unit._id}
                                            onChange={() => setEditingUnitId(unit._id)}
                                        />
                                        {editingUnitId === unit._id ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    value={unit.unitname}
                                                    onChange={(e) => {
                                                        setBooks((prevBooks) =>
                                                            prevBooks.map((prevBook) => ({
                                                                ...prevBook,
                                                                units: prevBook.units.map((prevUnit) =>
                                                                    prevUnit._id === unit._id ? { ...prevUnit, unitname: e.target.value } : prevUnit
                                                                )
                                                            }))
                                                        );
                                                    }}
                                                    onBlur={() => {
                                                        handleEditUnitName(unit._id, unit.unitname);
                                                    }}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleEditUnitName(unit._id, unit.unitname);
                                                        }
                                                    }}
                                                />
                                                <button onClick={() => handleEditUnitName(unit._id, unit.unitname)}>Save</button>
                                                <button onClick={() => setEditingUnitId(null)}>Cancel</button>
                                            </div>
                                        ) : (
                                            <div>
                                                <span>{unit.unitname}</span>
                                                <span onClick={() => setEditingUnitId(unit._id)}>✏️</span>
                                                <span onClick={() => handleDeleteUnit(unit._id)}>🗑️</span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Render words for the selected unit */}
                                    {editingUnitId === unit._id && (
                                        <div>
                                            {unit.words.map((word) => (
                                                <div key={word._id}>
                                                    <div>
                                                        <span>Eng Word: {word.engWord}</span>
                                                        <span>Uzb Word: {word.uzbWord}</span>
                                                        {editingWordId === word._id ? (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={word.engWord}
                                                                    onChange={(e) => {
                                                                        setBooks((prevBooks) =>
                                                                            prevBooks.map((prevBook) => ({
                                                                                ...prevBook,
                                                                                units: prevBook.units.map((prevUnit) => ({
                                                                                    ...prevUnit,
                                                                                    words: prevUnit.words.map((prevWord) =>
                                                                                        prevWord._id === word._id ? { ...prevWord, engWord: e.target.value } : prevWord
                                                                                    )
                                                                                }))
                                                                            }))
                                                                        );
                                                                    }}
                                                                />
                                                                <input
                                                                    type="text"
                                                                    value={word.uzbWord}
                                                                    onChange={(e) => {
                                                                        setBooks((prevBooks) =>
                                                                            prevBooks.map((prevBook) => ({
                                                                                ...prevBook,
                                                                                units: prevBook.units.map((prevUnit) => ({
                                                                                    ...prevUnit,
                                                                                    words: prevUnit.words.map((prevWord) =>
                                                                                        prevWord._id === word._id ? { ...prevWord, uzbWord: e.target.value } : prevWord
                                                                                    )
                                                                                }))
                                                                            }))
                                                                        );
                                                                    }}
                                                                />
                                                                <button onClick={() => handleEditWord(word._id, word.engWord, word.uzbWord)}>Save</button>
                                                                <button onClick={() => setEditingWordId(null)}>Cancel</button>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <span onClick={() => setEditingWordId(word._id)}>✏️</span>
                                                                <span onClick={() => handleDeleteWord(word._id)}>🗑️</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Add new word input fields */}
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Eng Word"
                                                    value={unit.newEngWord || ''}
                                                    onChange={(e) => setBooks((prevBooks) =>
                                                        prevBooks.map((prevBook) =>
                                                            prevBook._id === book._id ? {
                                                                ...prevBook,
                                                                units: prevBook.units.map((prevUnit) =>
                                                                    prevUnit._id === unit._id ? { ...prevUnit, newEngWord: e.target.value } : prevUnit
                                                                )
                                                            } : prevBook
                                                        ))}
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Uzb Word"
                                                    value={unit.newUzbWord || ''}
                                                    onChange={(e) => setBooks((prevBooks) =>
                                                        prevBooks.map((prevBook) =>
                                                            prevBook._id === book._id ? {
                                                                ...prevBook,
                                                                units: prevBook.units.map((prevUnit) =>
                                                                    prevUnit._id === unit._id ? { ...prevUnit, newUzbWord: e.target.value } : prevUnit
                                                                )
                                                            } : prevBook
                                                        ))}
                                                />
                                                <button onClick={() => {
                                                    handleAddWord(unit._id, unit.newEngWord, unit.newUzbWord);
                                                    // Clear the input fields after adding the word
                                                    setBooks((prevBooks) =>
                                                        prevBooks.map((prevBook) =>
                                                            prevBook._id === book._id ? {
                                                                ...prevBook,
                                                                units: prevBook.units.map((prevUnit) =>
                                                                    prevUnit._id === unit._id ? { ...prevUnit, newEngWord: '', newUzbWord: '' } : prevUnit
                                                                )
                                                            } : prevBook
                                                        ));
                                                }}>Add Word</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {/* Add new unit input fields */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Unit Name"
                                    value={book.newUnitName || ''}
                                    onChange={(e) => setBooks((prevBooks) =>
                                        prevBooks.map((prevBook) =>
                                            prevBook._id === book._id ? { ...prevBook, newUnitName: e.target.value } : prevBook
                                        ))}
                                />
                                <input
                                    type="text"
                                    placeholder="Unit Description"
                                    value={book.newUnitDescription || ''}
                                    onChange={(e) => setBooks((prevBooks) =>
                                        prevBooks.map((prevBook) =>
                                            prevBook._id === book._id ? { ...prevBook, newUnitDescription: e.target.value } : prevBook
                                        ))}
                                />
                                <button onClick={() => {
                                    handleAddUnit(book._id, book.newUnitName, book.newUnitDescription);
                                    // Clear the input fields after adding the unit
                                    setBooks((prevBooks) =>
                                        prevBooks.map((prevBook) =>
                                            prevBook._id === book._id ? { ...prevBook, newUnitName: '', newUnitDescription: '' } : prevBook
                                        ));
                                }}>Add Unit</button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Admin;
