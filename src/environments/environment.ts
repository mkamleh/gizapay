/** @format */

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,
  // apiUrl: "http://45.79.249.56:8080/mal_wrapper/redirect",
  // secureUrl: "http://45.79.249.56:8080/web_wrapper/redirect",

  // apiUrl: "http://localhost:8080/mal_wrapper/redirect",
  // secureUrl: "http://localhost:8080/web_wrapper/redirect",

  //local
  // apiUrl: "http://192.168.1.15:8080/redirect/",
  // apiUrl: "http://10.3.2.16:8080/mal_wrapper/redirect",
  // secureUrl: "http://10.3.2.16:8080/web_wrapper/redirect",
  apiUrl: window["env"]["apiUrl"],
  secureUrl: window["env"]["apiUrl"],
  API_URL:"http://45.79.249.56:8080/web_wrapper/redirect",
  defultLang: {
    id: 2,
    code: "en",
    direction: "ltr",
  },
};
