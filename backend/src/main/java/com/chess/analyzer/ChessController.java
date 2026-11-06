
package com.chess.analyzer;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
@CrossOrigin(origins = "http://localhost:5174")

@RestController
public class ChessController {

    @GetMapping("/api/chess/status")
    public String getStatus() {
        return "Chess Analyzer API is running!";
    }
}
