import React from 'react';
import styled from 'styled-components';

interface IFileUploadProps {
    handleFile: (arg0: any) => any;
    accepts: string;
    btnText?: string;
    style?: string;
}

// Style the Button component
const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
`;
const FileUploader = (props: IFileUploadProps) => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef<HTMLInputElement>(null);
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    if (hiddenFileInput.current) {
    hiddenFileInput.current.click();
    }
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file 
  const handleChange = (event: any) => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };
  return (
    <>
      <Button onClick={handleClick}>
        {props.btnText || 'Upload a file'}
      </Button>
      <input
        accept={props.accepts}
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{display: 'none'}}
      />
    </>
  );
}
export default FileUploader;