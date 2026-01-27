<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 30px;
        }
        .info-row {
            margin: 15px 0;
            padding: 10px;
            background-color: #f9fafb;
            border-left: 4px solid #4F46E5;
        }
        .info-row strong {
            color: #4F46E5;
            display: block;
            margin-bottom: 5px;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
        }
        .button:hover {
            background-color: #4338CA;
        }
        .footer {
            background-color: #f9fafb;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
            border-top: 1px solid #e5e7eb;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>❌ CRF Rejected</h1>
        </div>
        
        <div class="content">
            <p>Dear {{ $crf->fname }},</p>
            
            <p>Your Customer Request Form has been rejected.</p>
            
            <div class="info-row">
                <strong>CRF Number</strong>
                {{ $crf->crf_number }}
            </div>
            
            <div class="info-row">
                <strong>Category</strong>
                {{ optional($crf->category)->cname ?? 'N/A' }}
            </div>
            
            <div class="info-row">
                <strong>Issue</strong>
                {{ $crf->issue }}
            </div>
            
            <div class="info-row">
                <strong>Rejection Reason</strong>
                {{ $rejectionReason }}
            </div>

            <p>If you have any questions, please contact your Head of Unit or IT Department.</p>
            
            <div style="text-align: center;">
                <a href="{{ route('crfs.show', $crf->id) }}" class="button">
                    View CRF Details
                </a>
            </div>
        </div>
        
        <div class="footer">
            <p>This is an automated email from CRF System. Please do not reply.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>