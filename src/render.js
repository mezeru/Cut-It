const start = document.getElementById("start");
const stop = document.getElementById("stop");
const video = document.getElementById("video");
const sourceSelect = document.getElementById("select");

const {desktopCapturer, remote} = require("electron");
const { Menu } = remote;

start.onclick = () => {
    console.log("Start");
}

const selectSource = async (source) => {
    sourceSelect.innerText = source.name.charAt(0).toUpperCase() + source.name.slice(1);

    

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