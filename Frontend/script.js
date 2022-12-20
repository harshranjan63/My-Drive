
//Declerations
const isDevelopment=false;
const PORT = 8080
const socketurl = isDevelopment?`ws://localhost:${PORT}`:'ws://ec2-13-126-215-70.ap-south-1.compute.amazonaws.com:8080';
const fetchURL = isDevelopment?`http://localhost:${PORT}`:'http://ec2-13-126-215-70.ap-south-1.compute.amazonaws.com:8080';
let statas;
const socket = io(socketurl, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd"
  }
});
let li = " ";
//end

// send a message to the server
socket.on("connect", (...args) => {
  console.log("Welcome to My Drive!");
  socket.on("disconnect", (...args) => {
    console.log("Goodby!");
  })
})
//end

//drag and drop function
//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
dragText = dropArea.querySelector("header"),
button = dropArea.querySelector("button"),
input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
button.onclick = ()=>{
  input.click(); //if user click on the button then the input also clicked
}
input.addEventListener("change", function(){
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  // document.getElementById("filedat").files=this.files[0];
  showFile(); //calling function
});
//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});
//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  document.getElementById("filedat").files=event.dataTransfer.files[0];
  showFileinput.files[0](); //calling function
});
function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  console.log(fileType)
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="${fileURL}" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
  else if(fileType=="application/pdf"){
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="assets/pdf.png" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
  else if(fileType=="application/x-zip-compressed"){
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="assets/folder.png" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
  else if(fileType.includes("application")){
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="assets/docs.png" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
  else if(fileType.includes("text")){
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="assets/docs.png" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
  else{
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
      let fileURL = fileReader.result; //passing user file source in fileURL variable
        
      let imgTag = `<img src="assets/docs.png" alt="image">`; //creating an img tag and passing user selected file source inside src attribute
      dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
    }
    document.getElementById('fn').innerHTML = `${file.name}`;
    fileReader.readAsDataURL(file);
  }
}
//end

//functions to delete file
function deleteFile(fileName) {
  console.log(fileName)
  fetch(`${fetchURL}/delete/${fileName}`, { method: 'DELETE'}).then((result) => {
    if (result.status == 200) {
      location.reload();
    } else console.error(result);
  });
}
//end

//function to download file
function downloadFile(fileName) {
  console.log(fileName);
  fetch(`${fetchURL}/download/${fileName}`,{ mode: 'no-cors'})
    .then(response => response.blob())
    .then(blob => {
      console.log("downloading")
      var url = window.URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }).then((result) => {
      if (result.status == 200) {
        location.reload();
      } else console.log(result);
    });
}
//end

//A instance to fetch the list of files on cloud, it dires everytime the page reloads
fetch(`${fetchURL}/list`).then(response => response.json())
  .then(json => {
    console.log(json);
    let sno = 1;
    json.forEach(user => {
      console.log(user);
      li += `<tr id='d${sno}'>
                <td>${sno} </td>
                <td>${user} </td>
                <td><button type="button" class="btn btn-primary mb-3" onclick="deleteFile('${user}')">Delete File</button> &nbsp;&nbsp; <button type="button" class="btn btn-primary mb-3" onclick="downloadFile('${user}')">Download File</button></td>
            </tr>`;
      sno++;
    });
    document.getElementById('addfilelist').innerHTML = li;
  });
//end

//eventlistner to upload file on click
document.getElementById('upl').addEventListener('click', async () => {
  event.preventDefault();
  console.log("clicked!");
  const formData = new FormData();
  const fileField = file;
  if (fileField) {
    formData.append('file', fileField);
    formData.append('file', this.new_attachments)
    statas = 0
    await fetch(`${fetchURL}/upload`, {
      method: 'POST',
      body: formData,
      mode: 'no-cors'
    })
      .then((result) => {
        window.alert("File Uploaded successfully!!");
        console.log('Success:', result);
        location.reload();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    socket.emit("submitted");
    console.log("suscessful");
  } else {
    statas = 0
    event.preventDefault();
    window.alert("There is no file selected! Kindly select a file!")
  }
})
//end

