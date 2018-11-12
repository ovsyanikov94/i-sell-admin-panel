
'use strict';

const ValidatorConst = {

    //STATUS_DEAL
    TITLE_VALIDATOR : /^[a-zа-я0-9\s]{1,50}$/i,
    TEXT_VALIDATOR : /^[a-zа-я0-9\s]{1,500}$/i,
    STATUS_EVALUATION_VALUE_VALIDATOR : /^[0-5]$/,

    //USER
    USER_LOGIN_VALIDATOR: /^[a-z\d]{4,16}$/i,
    USER_PASSWORD_VALIDATOR: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,25}$/i,
    USER_EMAIL_VALIDATOR: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
    USER_FIRSTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,12}$/i,
    USER_LASTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,20}$/i,
    USER_PHONE_VALIDATOR: /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,

    COMMENT_MIN_LENGTH: 5,
    COMMENT_MAX_LENGTH: 500,
    COMMENT_DEFAULT_SKIP:0,
    COMMENT_DEFAULT_LIMIT:10,
    COMMENT_STATUS_AND_TYPE_VALIDATOR: /^[a-z\s]{1,20}$/i,
    COMMENT_DATE_VALIDATOR:/^\d{1,2}\/\d{1,2}\/\d{4}$/i

};

module.exports = ValidatorConst;
