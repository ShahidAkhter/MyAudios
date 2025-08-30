const captionsCalc = (currentTimeIs, captionPointsLength) => {
    try {

        for (let i = 0; i < captionPointsLength; i++) {
            const element = captionPoints[i]
            const elementNext = captionPoints[i + 1]

            if (element <= currentTimeIs && elementNext >= currentTimeIs) {
                captionsDisplayer.innerText = audioContent[index].captions[element][0];
                return;
            }
        }
        captionsDisplayer.innerText = audioContent[index].captions[captionPoints[captionPointsLength]][0];
        return;

    } catch (error) {

    }
}