import React, { useState, useEffect, useRef } from "react";

interface IProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  text: string;
  classNames?: string;
  placeholder?: string;
  name: string;
  id: string;
  onBlur: {
    (e: React.FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
}

const AutoTextArea = ({
  onChange,
  text,
  classNames,
  placeholder,
  name,
  id,
  onBlur,
}: IProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [textAreaHeight, setTextAreaHeight] = useState("auto");
  // const [parentHeight, setParentHeight] = useState("auto");

  useEffect(() => {
    // setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`);
    // console.log("use effect text a");
  }, [text]);

  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
    // setParentHeight(`${textAreaRef.current!.scrollHeight}px`);
    onChange(event);
  };

  return (
    <textarea
      style={{ height: textAreaHeight }}
      className={classNames}
      ref={textAreaRef}
      placeholder={placeholder ?? ""}
      onChange={onChangeHandler}
      onBlur={onBlur}
      value={text}
      name={name}
      id={id}
    />
  );
};

export default AutoTextArea;
