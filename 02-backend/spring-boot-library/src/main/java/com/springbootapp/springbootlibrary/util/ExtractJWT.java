package com.springbootapp.springbootlibrary.util;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

//custom class to extract JWT
public class ExtractJWT {


//    1) split token by dots 2) decode 3) read the information

    public static String payloadJWTExtraction(String token, String extraction) {
        token.replace("Bearer ", "");


//        token is split by header + payload + signature
        String[] chunks = token.split("\\.");

        Base64.Decoder decoder = Base64.getUrlDecoder();

        String payload = new String(decoder.decode(chunks[1]));

        String[] entries = payload.split(",");

//        map output = string key: string value
        Map<String, String> map = new HashMap<String, String>();

        for (String entry : entries) {
            String[] keyValue = entry.split(":");
            if (keyValue[0].equals(extraction)) {

                int remove = 1;
                if (keyValue[1].endsWith("}")) {
                    remove = 2;
                }

                keyValue[1] = keyValue[1].substring(0, keyValue[1].length() - remove);
                keyValue[1] = keyValue[1].substring(1);

                map.put(keyValue[0], keyValue[1]);

            }

        }

        if (map.containsKey(extraction)) {
            return map.get(extraction);
        }

        return null;
    }
}
