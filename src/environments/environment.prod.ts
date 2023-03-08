export const environment = {
  production: true,
  // apiUrl: "http://45.79.249.56:8080/mal_wrapper/redirect",
  // secureUrl: "http://45.79.249.56:8080/web_wrapper/redirect",


  // apiUrl: "http://localhost:8080/mal_wrapper/redirect",
  // secureUrl: "http://localhost:8080/web_wrapper/redirect",

  // apiUrl: "http://10.3.2.16:8080/mal_wrapper/redirect", //ethio test
  // secureUrl: "http://10.3.2.16:8080/web_wrapper/redirect",
  apiUrl: window["env"]["apiUrl"],
  secureUrl: window["env"]["apiUrl"],
  // apiUrl: "https://gizepay.bankofabyssinia.com/mal_wrapper/redirect",
  // secureUrl: "https://gizepay.bankofabyssinia.com/web_wrapper/redirect",

  // apiUrl: "https://gizepay.bankofabyssinia.com/mal_wrapper/redirect",
  // secureUrl: "https://gizepay.bankofabyssinia.com/web_wrapper/redirect",//prod

  
  // apiUrl: "https://10.101.2.53:8080/mal_wrapper/redirect",
  // secureUrl: "https://10.101.2.53:8080/web_wrapper/redirect",//preProd

  defultLang: {
    id: 2,
    code: "en",
    direction: "ltr",
  },
  SECRET_HASH: "$@y+>DUFbT3Fd9VA1s",
};
