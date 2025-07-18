package com.deepfakejava.facefortify.service;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class DeepwareService {

    private final String apiKey = "54cf4ca4-f6c9-480e-b485-9b4e088f3b54";
    private final String scanApiEndpoint = "https://api.deepware.ai/api/v1/url/scan";
    private final String reportApiEndpoint = "https://api.deepware.ai/api/v1/video/report";
    private final String uploadApiEndpoint = "https://api.deepware.ai/api/v1/video/scan";

    // Scan by URL
    public String scanVideoByUrl(String videoUrl) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Deepware-Authentication", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String requestUrl = scanApiEndpoint + "?video-url=" + videoUrl;

        try {
            ResponseEntity<String> response = restTemplate.exchange(requestUrl, HttpMethod.GET, entity, String.class);
            return response.getBody(); // Assume this returns the report ID as part of the response
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Exception occurred: " + e.getMessage() + "\"}";
        }
    }

    public String scanVideoByFile(MultipartFile file) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Deepware-Authentication", apiKey);
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        try {
            // Wrap the file into a ByteArrayResource for the request
            ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                @Override
                public String getFilename() {
                    return file.getOriginalFilename();
                }
            };

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("video", resource);

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(uploadApiEndpoint, HttpMethod.POST, requestEntity, String.class);

            return response.getBody(); // Return the response from the API
        } catch (IOException e) {
            e.printStackTrace();
            return "Exception occurred: " + e.getMessage();
        }
    }

    // Get scan report
    public String getScanReport(String videoId, String reportId) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Deepware-Authentication", apiKey);

        HttpEntity<String> entity = new HttpEntity<>(headers);

        String reportUrl = reportApiEndpoint + "?report-id=" + reportId;

        try {
            ResponseEntity<String> response = restTemplate.exchange(reportUrl, HttpMethod.GET, entity, String.class);
            return response.getBody(); // This should return the scan report
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\":\"Exception occurred: " + e.getMessage() + "\"}";
        }
    }
}