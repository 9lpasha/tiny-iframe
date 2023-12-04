import axios from "axios";

const validateImageSize = (file) => {
  const [maxWidth, maxHeight] = [10, 10];

  if (!maxWidth || !maxHeight || !file) {
    return true;
  }

  const i = new Image();

  i.src = file.preview;
  i.onload = () => {
    if (i.width > maxWidth || i.height > maxHeight) {
      console.log("ImageSizeMustNotExceed");
      this.setState({ files: [] });
      this.props.onFileUpload([]);
    }
  };
};

export const fileUpload = (files) => {
  if (files.length) {
    const data = new FormData();

    files.forEach((file, index) => {
      data.append(`file[${index}]`, file);
    });

    return axios(localStorage.getItem("baseURL") + "/api/file", {
      data,
      method: "POST",
      processData: false,
      contentType: false,
      cache: false,
      headers: {
        "x-auth-token": localStorage.getItem("HDAuthorizationToken")
      }
    });
  }
};