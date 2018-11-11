'use strict';

const ValidatorConst = {
    //STATUS_DEAL
    STATUS_TITLE_VALIDATOR : '/^[a-zа-я0-9]{1-50}$/i',
    STATUS_EVALUATION_TEXT_VALIDATOR : '/^[a-zа-я0-9]{1-500}(-?)$/i',
    STATUS_EVALUATION_VALUE_VALIDATOR : '/^[0-5]$/',

    //USER
    USER_LOGIN_VALIDATOR: '/^[a-z\\d]{4,16}$/i',
    USER_PASSWORD_VALIDATOR: '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{6,25}$/i',
    USER_EMAIL_VALIDATOR: '/^([a-z0-9_-]+\\.)*[a-z0-9_-]+@[a-z0-9_-]+(\\.[a-z0-9_-]+)*\\.[a-z]{2,6}$/i',
    USER_FERSNAME_VALIDATRO: '/^[a-zа-я]{1,12}$/i',
    USER_LASTNAME_VALIDATOR: '/^[a-zа-я]{1,20}$/i',
    USER_PHONE_VALIDATOR:'/^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$/i, /^\\+\\d{2}\\(\\d{3}\\)\\d{3}-\\d{2}-\\d{2}$/i',



}

module.exports = ValidatorConst