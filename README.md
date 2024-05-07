## How to Run this WebApp
- `Create` Folder named `media` at main folder.
  - *(e.g., MyAudios>media)*

- `Create` a another folders in `media` namely `captions`, `covers` and `sounds`.
  - *(e.g., MyAudios>media>captions,MyAudios>media>covers, MyAudios>media>sounds)*

- `add` in these three folders as they are channelsFolders like `syntax` as `channelName` *as you wish to give the name*.
  - *(e.g., MyAudios>media>captions>channelName,MyAudios>media>covers>channelName, MyAudios>media>sounds>channelName)*

- `add` mp3's in sounds as you want and named like that ``syntax`` as *TitleOfSound.BY.CreatorsName*.
  - *(e.g., MyAudios>media>captions>channelName>TitleOfSound.BY.CreatorsName)*

- `add` captions's in captions as `json file` as you want and named like that `syntax` as *TitleOfSound.BY.CreatorsName*.
  - *(e.g., MyAudios>media>covers>channelName>TitleOfSound.BY.CreatorsName.json)*

- `add` covers's in covers in `jpg format` as you want and named like that `syntax` as *TitleOfSound.BY.CreatorsName*.
  - *(e.g., MyAudios>media>sounds>channelName>TitleOfSound.BY.CreatorsName.jpg)*

## Format of captions
- Use this syntax to do so:
###### Give fonts to your captions in fontFamily key
```JSON
{
  "fontFamily":["Your font family name"],

  "SecondRoundOff": [
    "Your caption stays here"
  ],
  "SecondRoundOff": [
    "Your caption stays here"
  ]
}
```
  - e.g., 
  ```JSON
  {
    "fontFamily":["Arabic"],

    "1": [
      "No caption"
    ]
  }
  ```