Write-Host "Testing Alexa Skill Locally`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001/invoke"
$headers = @{
    "Content-Type" = "application/json"
}

function Test-Request {
    param (
        [string]$testName,
        [hashtable]$body
    )
    
    Write-Host "`nTesting: $testName" -ForegroundColor Yellow
    Write-Host "Sending request..." -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $baseUrl -Method Post -Headers $headers -Body ($body | ConvertTo-Json -Depth 10)
        Write-Host "Alexa's Response:" -ForegroundColor Green
        Write-Host $response.response.outputSpeech.ssml.Replace("<speak>", "").Replace("</speak>", "") -ForegroundColor White
        
        if ($response.response.reprompt) {
            Write-Host "`nReprompt:" -ForegroundColor Green
            Write-Host $response.response.reprompt.outputSpeech.ssml.Replace("<speak>", "").Replace("</speak>", "") -ForegroundColor Gray
        }
    }
    catch {
        Write-Host "Error occurred: $_" -ForegroundColor Red
    }
    
    Write-Host "`n-----------------------------------`n"
}

# Test 1: Launch Request
$launchRequest = @{
    version = "1.0"
    session = @{
        new = $true
        sessionId = "test-session-id"
        application = @{
            applicationId = "amzn1.ask.skill.test-skill-id"
        }
        user = @{
            userId = "test-user-id"
        }
    }
    context = @{
        System = @{
            application = @{
                applicationId = "amzn1.ask.skill.test-skill-id"
            }
            user = @{
                userId = "test-user-id"
            }
        }
    }
    request = @{
        type = "LaunchRequest"
        requestId = "test-request-id"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        locale = "en-US"
    }
}

# Test 2: Ask Claude Intent
$askClaudeRequest = @{
    version = "1.0"
    session = @{
        new = $false
        sessionId = "test-session-id"
        application = @{
            applicationId = "amzn1.ask.skill.test-skill-id"
        }
        user = @{
            userId = "test-user-id"
        }
    }
    context = @{
        System = @{
            application = @{
                applicationId = "amzn1.ask.skill.test-skill-id"
            }
            user = @{
                userId = "test-user-id"
            }
        }
    }
    request = @{
        type = "IntentRequest"
        requestId = "test-request-id"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        locale = "en-US"
        intent = @{
            name = "AskClaudeIntent"
            slots = @{
                question = @{
                    name = "question"
                    value = "what is artificial intelligence?"
                }
            }
        }
    }
}

# Test 3: Help Intent
$helpRequest = @{
    version = "1.0"
    session = @{
        new = $false
        sessionId = "test-session-id"
        application = @{
            applicationId = "amzn1.ask.skill.test-skill-id"
        }
        user = @{
            userId = "test-user-id"
        }
    }
    context = @{
        System = @{
            application = @{
                applicationId = "amzn1.ask.skill.test-skill-id"
            }
            user = @{
                userId = "test-user-id"
            }
        }
    }
    request = @{
        type = "IntentRequest"
        requestId = "test-request-id"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        locale = "en-US"
        intent = @{
            name = "AMAZON.HelpIntent"
        }
    }
}

# Test 4: Stop Intent
$stopRequest = @{
    version = "1.0"
    session = @{
        new = $false
        sessionId = "test-session-id"
        application = @{
            applicationId = "amzn1.ask.skill.test-skill-id"
        }
        user = @{
            userId = "test-user-id"
        }
    }
    context = @{
        System = @{
            application = @{
                applicationId = "amzn1.ask.skill.test-skill-id"
            }
            user = @{
                userId = "test-user-id"
            }
        }
    }
    request = @{
        type = "IntentRequest"
        requestId = "test-request-id"
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        locale = "en-US"
        intent = @{
            name = "AMAZON.StopIntent"
        }
    }
}

# Run all tests
Test-Request "Launch Request" $launchRequest
Test-Request "Ask Claude Intent" $askClaudeRequest
Test-Request "Help Intent" $helpRequest
Test-Request "Stop Intent" $stopRequest

Write-Host "All tests completed!" -ForegroundColor Cyan
