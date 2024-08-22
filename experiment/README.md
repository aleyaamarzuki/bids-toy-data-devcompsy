# Experiment

Experiment was made by Lenard Dome in 2023. The following experiment is only an example. The author is not responsible for any data collected from this experiment.

## License

This experiment is released under the AGPLv3 License. See the [LICENSE](LICENSE) file for more information.

## Files

*   experiment.js {javascript} building components of the experiment
*   index.html {webpage} front-end webpage running the experiment

## Local Debugging:

You can finish a block by pressing 'backspace'.

### CORS and SOP errors

If running on a local machine, rather than from a web server, you'll need to make the following changes:

#### Firefox

Enter `about:config` and set `privacy.file_unique_origin` to false. Change it
back to true once you're finished. See here for more detail:
[mozilla](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORrS/Errors/CORSRequestNotHttp).

It might be worth creating a separate Firefox profile just for this debugging.
It will separate any data relating to your every-day profile.

#### Chromium

Start up chromium (available via snap in Linux) with the following command
in the experiment directory:

```bash
chromium --disable-web-security --user-data-dir="[some directory here]"
```

More info can be found on [StackExchnage](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome),

#### Chrome

Start up Chrome with the following command in the experiment directory:

```bash
google-chrome --disable-web-security --user-data-dir="./tmp/"
```

On MacOS:

```bash
open -a Google\ Chrome --args --disable-web-security --user-data-dir="./tmp/"
```