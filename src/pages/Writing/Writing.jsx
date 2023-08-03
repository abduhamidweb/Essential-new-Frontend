
import "./index.scss"
import { useDispatch, useSelector } from "react-redux";
import { setCorrect, setInCorrect, setStartData } from "../../features/counter/counterSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import QumSoat from "../../components/QumSoat";
import { FaRedoAlt } from 'react-icons/fa';
const Writing = () => {
    const { controller, startDate } = useSelector((state) => state.counter);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState('');
    const [updatedArray, setUpdatedArray] = useState([]);
    const [cloneUpdatedArray, setCloneUpdatedArray] = useState([]);
    const [correctData, setCorrectData] = useState([]);
    const [incorrectData, setIncorrectData] = useState([]);
    const [errorData, setErrorData] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const headers = {
        'Content-Type': 'application/json',
        'token': localStorage.getItem("token")
    };



    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/auth");
            return;
        }
        async function getStartData() {
            try {
                const startDataResponse = await axios.post(`http://localhost:5000/api/start`, controller, { headers });
                setCloneUpdatedArray([...startDataResponse.data]);
                dispatch(setStartData(startDataResponse.data));
            } catch (error) {
                console.log("Error occurred while fetching start data:", error);
            }
        }
        getStartData();
    }, []);
    const handleVariantChange = (event) => {
        const variant = event.target.value;
        setSelectedVariant(variant);
        handleCheckAnswer(variant);
    };
    const handleCheckAnswer = (variant) => {
        const currentQuestion = startDate[currentIndex];
        const updatedQuestion = {
            ...currentQuestion,
            answer: variant || null
        };
        const newArray = [...updatedArray];
        newArray[currentIndex] = updatedQuestion;
        setUpdatedArray(newArray);
        setCurrentIndex(prevIndex => prevIndex + 1);
        setSelectedVariant('');
    };
    async function postEndData() {
        try {
            if (currentIndex >= startDate.length) {
                let res = await axios.post(`http://localhost:5000/api/end`, updatedArray, { headers });
                const { correct, incorrect, errorRes } = res.data
                setCorrectData([...correct]);
                setIncorrectData([...incorrect]);
                setErrorData([...errorRes]);
            }
        } catch (error) {
            console.log("Error occurred while posting end data:", error);
        }
    }
    useEffect(() => {
        if (currentIndex >= startDate.length) {
            postEndData();
        }
    }, [currentIndex, startDate.length, updatedArray]);
    const currentQuestion = startDate[currentIndex];
    console.log('currentQuestion :', currentQuestion);
    useEffect(() => {
        if (currentQuestion) {
            if (isEnglishQuestion(currentQuestion.question)) {
                speakQuestion(currentQuestion.question);
            }
        }
    }, [currentQuestion]);

    const isEnglishQuestion = (question) => {
        console.log('question :', question);
        if (typeof question !== 'string') {
            return false;
        }

        const englishCharsCount = question.split('').filter(char => /[a-zA-Z]/.test(char)).length;
        return englishCharsCount / question.length > 0.5;
    };

    const speakQuestion = (question) => {
        if (!question || typeof question !== 'string') {
            return;
        }

        // Check if the question is an English word (engWord)
        const isEnglishQuestion = typeof currentQuestion.engWord === 'string' &&
            currentQuestion.question.trim().toLowerCase() === currentQuestion.engWord.trim().toLowerCase();

        if (isEnglishQuestion) {
            const utterance = new SpeechSynthesisUtterance(question);
            speechSynthesis.speak(utterance);
        }
    };

    const handleReplayQuestion = () => {
        if (currentQuestion) {
            speakQuestion(currentQuestion.question);
        }
    };

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
    function findMatchingElements(correctData, allData) {
        const matchingElements = [];
        for (let i = 0; i < correctData.length; i++) {
            const unitId = correctData[i].unitId;
            for (let j = 0; j < allData.length; j++) {
                if (allData[j].unitId === unitId) {
                    matchingElements.push(allData[j]);
                    break; // Ichki tsikldan chiqish uchun break ishlatamiz
                }
            }
        }
        return matchingElements;
    }
    let allWordsTryAgain = () => {
        async function getStartData() {
            try {
                dispatch(setStartData(shuffle([...cloneUpdatedArray])));
                setCurrentIndex(0);
                setCorrectData([]);
                setIncorrectData([]);
                setErrorData([]);
            } catch (error) {
                console.log("Error occurred while fetching start data:", error);
            }
        }
        getStartData();
    }
    let allCorrectWordsTryAgain = () => {
        if (correctData.length) {
            const matchedElements = findMatchingElements(correctData, updatedArray);
            dispatch(setStartData([]));
            setUpdatedArray([...matchedElements]);
            dispatch(setStartData(shuffle([...matchedElements])));
            setCurrentIndex(0);
            setCorrectData([]);
            setIncorrectData([]);
            setErrorData([]);
        }
    }
    let allInCorrectWordsTryAgain = () => {
        if (incorrectData.length) {
            const matchedElements = findMatchingElements(incorrectData, updatedArray);
            dispatch(setStartData([]));
            setUpdatedArray([...matchedElements]);
            dispatch(setStartData(shuffle([...matchedElements])));
            setCurrentIndex(0);
            setCorrectData([]);
            setIncorrectData([]);
            setErrorData([]);
        }
    };
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleCheckButtonClick();
        }
    };

    const [inputValue, setInputValue] = useState('');

    const handleCheckButtonClick = () => {
        handleVariantChange({ target: { value: inputValue } });
        setInputValue('');
    };
    return (
        <div>
            {currentIndex < startDate.length ? (
                <>
                    <div className="quiz-app">
                        <div className="quiz-info">

                            <div className="count"><span> {
                                <QumSoat initialTime={startDate.length * 10} />
                            }</span></div>
                            <div className="count">Questions Count: <span>{startDate.length}</span></div>
                            <div className="count">End Words: <span>{currentIndex}</span></div>
                        </div>
                        <div className="quiz-area">
                            {currentQuestion.question}{' '}
                            <span style={{ cursor: 'pointer' }} onClick={handleReplayQuestion}>
                                <FaRedoAlt />
                            </span>
                        </div>
                        <div className="options-area">
                            <div className="form-control">
                                <input
                                    type="text" // Inputning type'ini text ga o'zgartiramiz
                                    className="mx-2 w-75 border border-none"
                                    value={inputValue}
                                    onChange={(event) => setInputValue(event.target.value)} // Tarjimani inputValue ga saqlaymiz
                                    onKeyPress={handleKeyPress}
                                />
                                <button onClick={handleCheckButtonClick}>Check</button>
                            </div>

                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="container ">
                        <div className="row border mt-5 p-5" >
                            <div className="col-lg-6 mx-auto col-md-6 col-sm-12">
                                <div className="result-section">
                                    <div className="result-items">
                                        <div className="d-flex mt-4">
                                            <h3>Topilgan so'zlarni qayta mustaxkamlang:</h3>
                                        </div>
                                        {correctData.length ? (
                                            correctData.map(item => (
                                                <p key={item._id}>{item.question} - {item.answer}</p>
                                            ))
                                        ) : (
                                            <p>Siz so'z topa olmadingiz.</p>
                                        )}
                                        <button className="btn mx-2 mx-2 try-again-btn  text-light btn w-75 mx-auto" onClick={allCorrectWordsTryAgain}>topilgan so'zlarni qayta o'ynash</button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 mx-auto col-md-6 col-sm-12">
                                <div className="result-section">
                                    <div className="result-items">
                                        <div className="d-flex mt-4">
                                            <h3>Topilmagan so'zlarni qayta o'ynang</h3>
                                        </div>
                                        {incorrectData.length ? (
                                            incorrectData.map(item => (
                                                <p key={item._id}>{item.question} - {item.answer}</p>
                                            ))
                                        ) : (
                                            <p>Siz hammasini to'g'ri topdingiz.</p>
                                        )}
                                        <button className="mx-2 try-again-btn  text-light btn w-75 mx-auto" onClick={allInCorrectWordsTryAgain}>topilmagan so'zlarni qayta o'ynash</button>

                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <button className="try-again-btn btn text-light " onClick={allWordsTryAgain}>Qaytadan o'ynash</button>
                                <button className="btn btn-danger text-light " onClick={() => navigate("/controller")}>
                                    Bosh menuga qaytish
                                </button>
                            </div>
                        </div>

                    </div>

                </>

            )}
        </div>
    );
};
export default Writing;
