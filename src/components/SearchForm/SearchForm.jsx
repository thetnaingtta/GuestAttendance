import React, { useState } from 'react';
import Input from '../UI/Input';
import classes from './SearchForm.module.css';

const SearchForm = props => {
    const [searchValue, setSearchValue] = useState('');

    // const searchHandler = event => {
    //     event.preventDefault();
    //     props.onSearch(searchValue);
    // };

    const inputChangeHandler = event => {
        const updatedValue = event.target.value;
        setSearchValue(updatedValue);
        props.onSearch(updatedValue);   
    };

    return <form className={classes.form}>
        <Input label={props.label} input={{
            id: 'name_' + props.id,
            type: 'text',
            value: searchValue,
            onChange: inputChangeHandler            
        }} />
        {/* <button onClick={searchHandler}>Search</button> */}
    </form>
};

export default SearchForm;