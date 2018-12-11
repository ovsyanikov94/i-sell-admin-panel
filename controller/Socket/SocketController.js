"use strict";

const userSockets = [];

function OnDisconnect( socket ) {

    let user = userSockets.find( u => u.socket === socket );

    if(user) {

        let index = userSockets.indexOf(user);

        userSockets.splice( index , 1 );

        console.log('disconnect!');
    }//if
    else{
        console.log('disconnect fail!');
    }//else
}//OnDisconnect

function OnConnection( socket ) {

    console.log('connection!');

    socket.on('disconnect' , OnDisconnect );

    socket.on('message:auth' , OnUserAuth.bind( socket ) );

    socket.on('message:NewComment' , OnNewComment );

}//OnConnection

function OnUserAuth( payload ) {

    let socket = this;

    console.log('payload: ' , payload);

    let checkUser = userSockets.find( u => u.user.userID === payload.id );

    if(!checkUser){

        userSockets.push( {
            user: {
                userID: payload.id
            },
            socket: socket
        } );

    }//if

}//OnUserAuth

function OnNewComment( payload ) {

    for( let i = 0 ; i < userSockets.length ; i++ ){

        userSockets[i].socket.emit('message:NewComment' , payload );

    }//for i

}//OnNewComment

module.exports.InitSocketConnection = function ( io ) {

    io.on( 'connection' , OnConnection );

};