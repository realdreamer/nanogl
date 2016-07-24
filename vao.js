

function Vao( gl ){
  this.gl = gl;

  this._ext = gl.getExtension( 'OES_vertex_array_object' );

  if( this._ext ){
    this._impl = new NativeVao( this );
  } else {
    this._impl = new EmulateVao( this );
  }

}

Vao.prototype = {


  dispose : function(){
    this._impl.dispose();
    this._impl = null;
    this._ext = null;
  },


  setup : function( prg, buffers ){
    if( !prg.ready ){
      prg._grabParameters();
    }
    this._impl.setup( prg, buffers );
  },


  bind : function(){
    this._impl.bind();
  },


  unbind : function(){
    this._impl.unbind();
  }


};


// ---------------------------
//   Native Implementation
// ---------------------------

function NativeVao( vao ){
  this._vao = vao;
  this._handle = null;
}

NativeVao.prototype = {


  dispose : function(){
    this.release();
    this._vao = null;
  },


  setup : function( prg, buffers ){
    this.release();
    var ext = this._vao._ext;

    this._handle = ext.createVertexArrayOES();
    ext.bindVertexArrayOES( this._handle );

    for (var i = 0; i < buffers.length; i++) {
      buffers[i].attribPointer( prg );
    }

    ext.bindVertexArrayOES( null );
  },


  bind : function(){
    var ext = this._vao._ext;
    ext.bindVertexArrayOES( this._handle );
  },


  unbind : function(){
    var ext = this._vao._ext;
    ext.bindVertexArrayOES( null );
  },


  release : function(){
    var ext = this._vao._ext;
    if( this._handle ){
      ext.deleteVertexArrayOES( this._handle );
      this._handle = null;
    }
  }



};


// ---------------------------
//   Emulation Implementation
// ---------------------------

function EmulateVao( vao ){
  this._vao = vao;
}

EmulateVao.prototype = {


  dispose : function(){
    this._vao = null;
    this.prg = null;
    this.buffers = null;
  },


  setup : function( prg, buffers ){
    this.prg = prg;
    this.buffers = buffers;
  },


  bind : function(){
    for (var i = 0; i < this.buffers.length; i++) {
      this.buffers[i].attribPointer( this.prg );
    }
  },


  unbind : function(){
    // noop
  },

};


module.exports = Vao;