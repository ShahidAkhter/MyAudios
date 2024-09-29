## How to MyAudios
- `Create` Folder named `media` at main folder.
  - *(e.g., MyAudios>media)*

- `Create` folders *channelName* (of your choice) in `media`.
  - *(e.g., MyAudios>media>channelName)*

- Inside *channelName* `Create` folders namely `captions`, `covers` and `audios`.
  - *(e.g., MyAudios>media>channelName>audios, MyAudios>media>channelName>covers, MyAudios>media>channelName>captions)*

- `add` mp3's in audios as you want and named like that ``syntax`` as *TitleOfAudio.BY.CreatorsName*.
  - *(e.g., MyAudios>media>channelName>audios>TitleOfAudio.BY.CreatorsName.mp3)*

- `add` captions's in captions as `json file` as you want and named like that `syntax` as *TitleOfAudio.BY.CreatorsName*.
  - *(e.g., MyAudios>media>channelName>captions>TitleOfAudio.BY.CreatorsName.json)*

- `add` covers's in covers in `jpg format` as you want and named like that `syntax` as *TitleOfAudio.BY.CreatorsName*.
  - *(e.g., MyAudios>media>channelName>covers>TitleOfAudio.BY.CreatorsName.jpg)*

## Format of captions
- Use this syntax to do so:
###### Give fonts to your captions in fontFamily key.

#### *t0=first caption time, t1=second caption time*
#### *t0, t1 are in seconds(s)*

```JSON
{
  "fontFamily":["Your font family name"],

  "t0": [
    "Your caption stays here"
  ],
  "t1": [
    "Your caption stays here"
  ]
}
```
  - e.g., 
  ```JSON
  {
    "fontFamily":["Arabic"],

    "1": [
      "---"
    ]
  }
  ```