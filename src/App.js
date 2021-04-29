import React, { useCallback, useState } from "react";
import Contents from "./components/Contents";
import Header from "./components/Header";

import { countries } from "./data/Countries";
import "./App.css";
import Footer from "./components/Footer";

const App = () => {
    const [selectCountry, SetSelectCountry] = useState("KR");
    const [nameCountry, SetNameCountry] = useState("Korea (South)");

    const onHandleCountry = useCallback((e) => {
        const select = countries.filter((v) => v.Country === e.target.value)[0];
        console.log(select);
        const countryIso = select.ISO2;
        const countryName = select.Country;
        SetSelectCountry(countryIso);
        SetNameCountry(countryName);
    }, []);

    return (
        <div className="App">
            <Header onHandleCountry={onHandleCountry} />
            <Contents countryParams={selectCountry} countryName={nameCountry} />
            <Footer />
        </div>
    );
};

export default App;
