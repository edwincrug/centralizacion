registrationModule.controller("documentoController", function ($scope, $rootScope, localStorageService, alertFactory, documentoRepository) {

    //Propiedades
    //Desconfiguramos el clic izquierdo en el frame contenedor de documento
    var errorCallBack = function (data, status, headers, config) {
        $('#btnEnviar').button('reset');
        alertFactory.error('Ocurrio un problema');
    };

    //Métodos
    $scope.VerDocumento = function(doc) {
        if(doc.consultar == 1){
            //alert(doc.idDocumento);
            if(doc.idDocumento == 14)
            {               
                $scope.folioActual = doc.folio;
                //alert(doc.idDocumento);
                documentoRepository.getDocsByFolio(doc.folio)//$rootScope.currentDocument.folio)
                .success(muestraPolizasSuccessCallback)
                .error(errorCallBack);
            }
            else
             {   
                //Muestra Documento
                var pdf_link = doc.existeDoc;//doc.Ruta;                
                /*var arreglo =  pdf_link.split(".");
                var typeAplication = 'application/pdf';
                switch(arreglo[arreglo.length - 1].toLowerCase())
                {                    
                    case 'jpg': 
                                typeAplication = 'image/jpeg';
                                break;    
                    case 'png': 
                                typeAplication = 'image/png';
                                break;
                    case 'gif': 
                                typeAplication = 'image/gif';
                                break;    
                    case 'jpeg': 
                                typeAplication = 'image/jpeg';
                }*/

                var typeAplication = $rootScope.obtieneTypeAplication(pdf_link);    

                var titulo = doc.folio + ' :: ' + doc.descripcion;
                //var iframe = '<div id="hideFullContent"><div id="hideFullMenu"> </div><iframe id="ifDocument" src="' + pdf_link + '" frameborder="0"></iframe> </div>';
                var iframe = '<div id="hideFullContent"><div id="hideFullMenu" onclick="nodisponible()" ng-controller="documentoController"> </div> <object id="ifDocument" data="' + pdf_link + '" type="' + typeAplication +'" width="100%" height="100%"><p>Alternative text - include a link <a href="' + pdf_link + '">to the PDF!</a></p></object> </div>';
                $.createModal({
                    title: titulo,
                    message: iframe,
                    closeButton: false,
                    scrollable: false
                }); 
            }
        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }        
    };

    $rootScope.obtieneTypeAplication = function(ruta){

        var arreglo =  ruta.split(".");
        var typeAplication = 'application/pdf';
                switch(arreglo[arreglo.length - 1].toLowerCase())
                {                    
                    case 'jpg': 
                                typeAplication = 'image/jpeg';
                                break;    
                    case 'png': 
                                typeAplication = 'image/png';
                                break;
                    case 'gif': 
                                typeAplication = 'image/gif';
                                break;    
                    case 'jpeg': 
                                typeAplication = 'image/jpeg';
                }

        return  typeAplication;
    };

    $scope.NoDisponible = function() {
        alertFactory.error('Función deshabilitada en digitalización.');
    };

    ///////////////////////////////////////////////////////////////////////////////////
    ///Envío de documentos

    $scope.ShowEnviar = function(doc) {
        if(doc.enviarEmail == 1){
           $('#modalSend').modal('show');
           $rootScope.currentDocument = doc;
        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }
    };

    var enviarDocumentoSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Documento enviado correctamente.');
        $('#btnEnviar').button('reset');
        $('#modalSend').modal('hide');
    };

    //LQMA 19012015
    var muestraPolizasSuccessCallback = function (data, status, headers, config) {
        var iframe = '<div id="hideFullContent"><div><ul class="nav nav-tabs"> ';           
        
        angular.forEach(data, function (value, key) {
            if(key == 0)
            {
               iframe = iframe + '<li class="active"><a data-toggle="tab" href="#divMenu'+ key +'" target="_self">Póliza '+(key+1)+' </a></li>';
            }
            else    
            {
                iframe = iframe + '<li><a data-toggle="tab" href="#divMenu'+ key +'" target="_self">Póliza '+(key+1)+' </a></li>';
            }
        });   

        iframe = iframe + '</ul></div> <div class="tab-content">';

         angular.forEach(data, function (value, key) {
                
            if(key == 0)
            {
               iframe = iframe + '<div class="tab-pane active" id="divMenu'+key+ '"><iframe src="'+value+'" width="560" height="350" allowfullscreen="allowFullScreen"></iframe></div>';
            }
            else    
            {
                iframe = iframe + '<div class="tab-pane" id="divMenu'+key+ '"><iframe src="'+value+'" width="560" height="350" allowfullscreen="allowFullScreen"></iframe></div>';
            }
        });   

        iframe = iframe + '</div></div>';

        $.createModal({
            title: "Pólizas de Transferencia",//titulo,
            message: iframe,
            closeButton: false,
            scrollable: false
        });
            
    };

    $scope.EnviarDocumento = function() {
        if($rootScope.currentDocument.consultar == 1){
        $('#btnEnviar').button('loading');
           documentoRepository.sendMail($rootScope.currentDocument.idDocumento, $rootScope.currentDocument.folio,$scope.correoDestinatario)
            .success(enviarDocumentoSuccessCallback)
            .error(errorCallBack);
        }
        else{
            alertFactory.warning('Acción no permitida para su perfil.');
        }
    };

    //////////////////////////////////////////////////////////////////////////
    /// Carga de documentos

    $scope.openUpload = function(){

        var documento=  {   "idProceso": 1,
                            "idNodo":   2,
                            "nombreNodo": "",
                            "folio" : $rootScope.currentFolioFactura,
                            "nombreDocumento" : "",
                            "idDocumento" : 15,
                            "origen" : "",
                            "descripcion" : "",
                            "idPerfil" : "",
                            "consultar" : "",
                            "imprimir" : "",
                            "enviarEmail" : "",
                            "descargar" : "",
                            "cargar" : "",
                            "estatusNombre" : "",
                            "idEstatus" : "",
                            "Ruta" : "",
                            "existeDoc" : ""
                            };        

        $scope.ShowCargar(documento);
    };

    $scope.ShowCargar = function(doc) {
        $('#frameUpload').attr('src', '/uploader');
        $('#modalUpload').modal('show');
        $rootScope.currentUpload = doc;
    };

    var uploadSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Documento cargado');
    };

    $scope.CargarDocumento = function(){
        documentoRepository.uploadFile($("#fileDoc")[0].files[0])
            .success(uploadSuccessCallback)
            .error(errorCallBack);
    };

    $scope.FinishUpload = function(name){
        alertFactory.success('Se guardo el documento ' + name);
        var doc = $rootScope.currentUpload;

        documentoRepository.saveDocument(doc.folio, doc.idDocumento, 1, 1, doc.idNodo, 1, global_settings.uploadPath + '/' + name)
            .success(saveDocumentSuccessCallback)
            .error(errorCallBack);
    };

    var saveDocumentSuccessCallback = function (data, status, headers, config) {
        alertFactory.success('Documento guardado.');
        //actualizar los nodos para mostrar botonerass
        //goToPage($scope.currentPage);       

        var url = window.location.pathname;
        //alert(url);
        if(url == '/Factura'){
            $rootScope.muestraDocumentos();
        }
        else{
            setTimeout( function(){
                $rootScope.LoadActiveNode();
                } ,200);
            }
    };
});

/*var nameDocument = '';
function refresh() {
  var scope = angular.element($("#modalUpload")).scope();
  scope.$apply(function(){
    scope.FinishUpload(nameDocument);
  })
}*/
