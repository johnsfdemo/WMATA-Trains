public without sharing class WMATAController {

	@AuraEnabled    
    public static String getWMATAPayload (String metroAPIKey, String url) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        request.setEndpoint(url);
        request.setMethod('GET');
        request.setHeader('api_key', metroAPIKey);
        
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200)
            return response.getBody();            
        else
            return null;        
    }
    
}