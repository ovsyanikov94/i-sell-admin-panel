'use strict';

const ValidatorConst = {

    //STATUS_DEAL
    TITLE_VALIDATOR : /^[a-zа-я0-9\s]{1,50}$/i,
    TEXT_VALIDATOR : /^[a-zа-я0-9\s]{1,500}$/i,
    STATUS_EVALUATION_VALUE_VALIDATOR : /^[0-5]$/,

    //USER
    USER_LOGIN_VALIDATOR: /^[a-z\d]{4,16}$/i,
    USER_PASSWORD_VALIDATOR: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,50}$/i,
    USER_HASH_PASSWORD_VALIDATOR:/^[A-Za-z0-9]{1,60}$/,
    USER_EMAIL_VALIDATOR: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
    USER_FIRSTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,12}$/i,
    USER_LASTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,20}$/i,
    USER_PHONE_VALIDATOR: /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,

    LOT_DESCRIPTION_VALIDATOR: /^.*$/i,
    LOT_START_PRICE: 0,
    LOT_RATE: 0,
};

module.exports = ValidatorConst;