export default class Tokenizer {

  public static replace( given_string:string, token:string, val:string ) {
    return given_string.replace( '[:' + token.toString() + ':]', val)
  }

}