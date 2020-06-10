const http = require( 'http' );

class Token {
	constructor() {
		this.tokenData = new Array( parseInt( Math.random() * 1000 ) ).fill( 'foo' );
		this.refreshDate = new Date();
	}

	startRefreshing() {
		this._interval = setInterval( () => this.refreshDate = new Date(), 1000 );
	}

	stopRefreshing() {
		clearInterval( this._interval );
	}
}

class ClientTokens {
	constructor() {
		this.tokens = [];
	}
}

const clientTokens = new ClientTokens();

function requestListener( req, res ) {

	if ( req.url === '/connect' ) {
		const token = new Token();
		token.startRefreshing();

		clientTokens.tokens.push( token ); // Add token.

		res.writeHead( 200, { 'Content-Type': 'application/json' } );
		res.write( `Connected! Current clients: ${ clientTokens.tokens.length }` );
		res.end();
	} else if ( req.url === '/disconnect' ) {
		clientTokens.tokens.pop(); // Remove token.

		res.writeHead( 200, { 'Content-Type': 'text/html; charset=utf-8' } );
		res.write( `Disconnected! Current clients: ${ clientTokens.tokens.length }` );
		res.end();
	} else {
		res.end( 'Invalid request' );
	}
}

const server = http.createServer( requestListener );
server.listen( process.env.PORT || 3000 );
