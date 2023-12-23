import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import debounce from 'lodash.debounce';

const FormInput = ({
  placeholder,
  name,
  type,
  inputMode = "",
  pattern = ".*|^$",
  messageError = "",
  setFormError = () => { },
  initialValue = "",
  setIsEdit = () => { },
  size = "",
  isRequired = false,
}) => {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);
  const ref = useRef();

  const handleChange = useMemo(() =>
    debounce((event) => {
      const isValid = (isRequired ? event.target.validity.valid && !!event.target.value : event.target.validity.valid);
      const isEdit = event.target.value !== initialValue;
      setError(!isValid);
      setFormError((prev) => ({
        ...prev,
        [`${name}HasError`]: !isValid,
      }));
      setIsEdit((prev) => ({
        ...prev,
        [`${name}isEdit`]: isEdit,
      }));
    }, 1000),
    [initialValue, isRequired, name, setFormError, setIsEdit]
  );

  const handleInputChange = useCallback((event) => {
    setUserInput(event.target.value);
    handleChange(event);
  }, [handleChange, setUserInput]);

  const inputStyle = useMemo(() => {
    if (error) return { backgroundColor: 'rgba(255, 0, 0, 0.1)' };
    return null;
  }, [error]);

  const labelStyle = useMemo(() => ({
    display: userInput ? 'block' : 'none',
    color: error ? '#ff0000' : '#435f7a',
  }), [error, userInput]);

  const labelText = useMemo(() => {
    return error ? messageError : placeholder;
  }, [error, messageError, placeholder]);

  const placeholderStyle = useMemo(() => (
    (!userInput && error) ? 'empty-field' : ''
  ), [error, userInput]);

  const placeholderText = useMemo(() => {
    if (!userInput && error) {
      return `Campo ${name} obbligatorio`;
    }
    return placeholder;
  }, [error, name, placeholder, userInput])

  useEffect(() => {
    setUserInput(initialValue);
  }, [initialValue])

  return (
    <div className={`input-wrapper ${size === "small" ? "small" : ""}`}>
      <input
        className={placeholderStyle}
        placeholder={placeholderText}
        name={name}
        type={type}
        inputMode={inputMode}
        onChange={handleInputChange}
        value={userInput}
        pattern={pattern}
        style={inputStyle}
        ref={ref}
      />
      <span
        style={labelStyle}
        className='placeholder-label'
      >
        {labelText}
      </span>
    </div>
  );
}

export default FormInput;
