export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'
export const EMAIL_RULE = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const EMAIL_RULE_MESSAGE = 'Email is not valid. (example@mail.com)';
export const PASSWORD_RULE = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
export const PASSWORD_RULE_MESSAGE = 'Password must be at least 8 characters long, contain at least one letter and one number';
export const FIELD_REQUIRED_MESSAGE = 'This field is required';