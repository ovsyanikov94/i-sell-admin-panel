'use strict';

const ValidatorConst = {
    STATUS_TITLE_VALIDATOR : '/^[a-zа-я0-9]{1-50}$/i',
    STATUS_EVALUATION_TEXT_VALIDATOR : '/^[a-zа-я0-9]{1-500}(-?)$/i',
    STATUS_EVALUATION_VALUE_VALIDATOR : '/^[0-5]$/',
}

module.exports = ValidatorConst