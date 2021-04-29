import React from "react";
import { countries } from "../data/Countries";

const Header = ({ onHandleCountry }) => {
    return (
        <header className="header">
            <h1>COVID-19</h1>
            <select
                defaultValue={countries[11].Country}
                onChange={onHandleCountry}
            >
                {countries.map((country) => (
                    <option key={country.Slug}>{country.Country}</option>
                ))}
            </select>
        </header>
    );
};

export default Header;
