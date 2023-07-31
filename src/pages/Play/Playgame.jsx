import "./index.scss"
import { useDispatch, useSelector } from "react-redux";
import { setCorrect, setInCorrect, setStartData } from "../../features/counter/counterSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Playgame = () => {
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
    return (
        <div>
            {currentIndex < startDate.length ? (
                <>
                    <div className="quiz-app">
                        <div className="quiz-info">
                            <div className="count">Questions Count: <span>{startDate.length}</span></div>
                            <div className="count">End Words: <span>{currentIndex}</span></div>
                        </div>
                        <div className="quiz-area">
                            {currentQuestion.question}
                        </div>
                        <div className="options-area">
                            {currentQuestion.variants.map(variant => (
                                <label key={variant} className="form-control">
                                    <input
                                        type="radio"
                                        className="mx-2"
                                        value={variant}
                                        checked={selectedVariant === variant}
                                        onChange={handleVariantChange}
                                    />
                                    {variant}
                                </label>
                            ))}
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
export default Playgame;
