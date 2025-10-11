import { createContext, useState } from "react";

export const DisplayCreditDebitContext = createContext();

export const DisplayCreditDebitProvider = ({ children }) => {
    const [displayCreditDebit, setDisplayCreditDebit] = useState(false);
    const [creditDebitData, setCreditDebitData] = useState(null);
    const [returnRequestData, setReturnRequestData] = useState([]);

    return (
        <DisplayCreditDebitContext.Provider value={{
            displayCreditDebit,
            setDisplayCreditDebit,
            creditDebitData,
            setCreditDebitData,
            returnRequestData,
            setReturnRequestData
        }}>
            {children}
        </DisplayCreditDebitContext.Provider>
    );
};
