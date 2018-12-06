'use strict';

const ValidatorConst = {

    //STATUS_DEAL
    TITLE_VALIDATOR : /^[a-zа-я0-9\s]{1,50}$/i,
    TEXT_VALIDATOR : /^[a-zа-я0-9\s.?!&\-+:;*%@#_№'"()\]\[]{1,1500}$/i,
    STATUS_EVALUATION_VALUE_VALIDATOR : /^[0-5]$/,

    //USER
    USER_LOGIN_VALIDATOR: /^[a-z\d]{4,16}$/i,
    USER_PASSWORD_VALIDATOR: /^[a-z_?!^%()\d]{6,30}$/i,
    USER_HASH_PASSWORD_VALIDATOR:/^[A-Za-z0-9]{1,60}$/,
    USER_EMAIL_VALIDATOR: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i,
    USER_FIRSTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,12}$/i,
    USER_LASTNAME_VALIDATOR: /^[a-zа-я\s\-.]{1,20}$/i,
    USER_PHONE_VALIDATOR: /^\+\d{2}\(\d{3}\)\d{3}-\d{2}-\d{2}$/i,
    USER_COUNT_MONEY: 0,
    //LOT
    LOT_DESCRIPTION_VALIDATOR: /^.*$/i,
    LOT_START_PRICE: 0,
    LOT_RATE: 0,
    LOT_COUNTHOUR_MIN_VALIDATOR: 0,
    LOT_COUNTHOUR_MAX_VALIDATOR: 48,
    LOT_DATE_VALIDATOR: 0,
    LOT_COUNTHOUR_VALIDATOR:0,

    //COMMENTS
    COMMENT_MIN_LENGTH: 5,
    COMMENT_MAX_LENGTH: 500,
    COMMENT_DEFAULT_SKIP:0,
    COMMENT_DEFAULT_LIMIT:10,
    COMMENT_TYPE_ID:/^[1-2]{1}/i,
    COMMENT_STATUS_ID:/^[1-3]{1}/i,
    COMMENT_STATUS_AND_TYPE_VALIDATOR: /^[a-z\s]{1,20}$/i,
    COMMENT_DATE_VALIDATOR:0,
    MARK_LIKE:1,
    MARK_DISLIKE:0
};

module.exports = ValidatorConst;