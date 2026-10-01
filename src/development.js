export const developmentEnabled=(argv=process.argv,env=process.env)=>argv.includes('--development')&&env.NODE_ENV!=='production';
export function injectQA(html){return html.replace('</head>','<meta name="northline-development" content="true"><link rel="stylesheet" href="/src/qa.css"><script src="/src/qa-arrival.js"></script><script type="module" src="/src/qa.js"></script></head>');}
