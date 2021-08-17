const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.querySelector("video");
const sourceSelect = document.getElementById("select");

let mediaRecorder;
const recordedChunks = [];

const {desktopCapturer, remote} = require("electron");
const {writeFile} = require("fs")
const { dialog ,Menu } = remote;

start.onclick = e => {
    mediaRecorder.start();
    start.classList.add('is-danger');
    start.innerText = 'Recording';
  };

stop.onclick = e =>{
    mediaRecorder.stop();
    start.classList.remove('is-danger');
    start.innerText = 'Start';
}



const selectSource = async (source) => {
    sourceSelect.innerText = source.name.charAt(0).toUpperCase() + source.name.slice(1);

    const constrains = {
        audio:false,
        video:{
            mandatory:{
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    const stream = await navigator.mediaDevices.getUserMedia(constrains);
    video.srcObject = stream;
    video.play();

    const options = { mimeType: 'video/webm; codecs=vp9' }
    mediaRecorder = new MediaRecorder(stream, options);
    mediaRecorder.ondataavailable = handledata;
    mediaRecorder.onstop = handleStop;
}

async function handledata(e) {
    console.log('Video data available');
    recordedChunks.push(e.data);
}

async function handleStop(e) {
    const blob = new Blob(recordedChunks, {
      type: 'video/webm; codecs=vp9',
    });
  
    const buffer = Buffer.from(await blob.arrayBuffer());
  
    const { filePath } = await dialog.showSaveDialog({
        buttonLabel: 'Save Video',
        defaultPath: `vid-${Date.now()}.webm`
    })
  
    console.log(filePath);
  
    writeFile(filePath, buffer, () => console.log('Saved Successfully'))
  }


const getSources = async () =>{

    const sources = await desktopCapturer.getSources({
        types:['window','screen']
    });

    const listSources = Menu.buildFromTemplate(
        sources.map(source => {
            return{
                label: source.name.charAt(0).toUpperCase() + source.name.slice(1),
                click: ()=> {
                    selectSource(source);
                }
            }
        })
    )

    listSources.popup();

    

}
sourceSelect.onclick = getSources;