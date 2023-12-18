export default function elementFromHTML(htmlString){
  const parser = new DOMParser()
  return parser.parseFromString(htmlString.trim(), 'text/html').body.firstChild
}