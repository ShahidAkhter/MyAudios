const captionsCalc=(currentTimeIs)=>{
    for (let i = 0; i < captionPoints.length - 1; i++) {
        const element = parseInt(captionPoints[i])
        const elementNext = parseInt(captionPoints[i + 1])

        if (element <= currentTimeIs && elementNext >= currentTimeIs) {
            captionsDisplayer.innerText = audioContent[index].captions[element][0];
            return;
        }
    }
    captionsDisplayer.innerText = audioContent[index].captions[captionPoints[captionPoints.length - 1]][0];
}