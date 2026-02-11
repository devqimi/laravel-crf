import { FileDown } from 'lucide-react';
import { useRef } from 'react';

type CrfData = {
    id: number;
    crf_number: string;
    fname: string;
    nric: string;
    department: { dname: string };
    designation: string;
    extno: string;
    category: { cname: string };
    factor?: { id: number; name: string } | null;
    issue: string;
    reason: string;
    application_status: { status: string };
    approved_by_hou_at?: string;
    it_hou_approved_at?: string;
    it_hou_approved_by?: string;
    approved_by_tp_at?: string;
    approver: { name: string } | null;
    it_hou_approver: { name: string } | null;
    tp_approver: { name: string } | null;
    assigned_user: { name: string } | null;
    created_at: string;
    it_remark: string | null;
    rejection_reason?: string;
    redirect_reason?: string;
};

type StatusTimeline = {
    id: number;
    status: string;
    action_by: string;
    remark: string | null;
    created_at: string;
};

type Attachment = {
    id: number;
    name: string;
    size: number;
};

interface CrfPdfExportProps {
    crf: CrfData;
    statusTimeline?: StatusTimeline[];
    attachments?: Attachment[];
}

export const CrfPdfExport: React.FC<CrfPdfExportProps> = ({ 
    crf, 
    statusTimeline = [], 
    attachments = [] 
}) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const originalTitle = document.title;
        document.title = `CRF-${crf.crf_number}`;
        
        window.print();
        
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString + 'Z').toLocaleString('en-MY', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDateShort = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-MY', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <>
            {/* PDF Export Button */}
            <button
                onClick={handlePrint}
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#2563eb';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                }}
            >
                <FileDown style={{ width: '18px', height: '18px' }} />
                Export to PDF
            </button>

            {/* Hidden content for printing */}
            <div ref={printRef} className="print-content">
                <style>{`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        
                        .print-content,
                        .print-content * {
                            visibility: visible;
                        }
                        
                        .print-content {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                        }
                        
                        @page {
                            size: A4;
                            margin: 10mm 12mm 10mm 12mm;
                        }
                        
                        .print-content * {
                            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }
                        
                        .section-break {
                            page-break-inside: avoid;
                        }
                        
                        table {
                            page-break-inside: avoid;
                        }
                    }
                    
                    @media screen {
                        .print-content {
                            display: none;
                        }
                    }
                `}</style>

                {/* Corporate Document Content */}
                <div style={{
                    padding: '0',
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontSize: '8pt',
                    lineHeight: '1.3',
                    color: '#1a1a1a',
                    backgroundColor: '#ffffff',
                }}>
                    {/* Document Header */}
                    <div style={{ 
                        borderBottom: '2px solid #2563eb', 
                        paddingBottom: '8px', 
                        marginBottom: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img 
                                src="https://images.seeklogo.com/logo-png/9/1/negara-malaysia-jata-negara-logo-png_seeklogo-98007.png" 
                                alt="Organization Logo" 
                                style={{ 
                                    height: '80px',
                                    width: 'auto'
                                }} 
                            />
                            <div>
                                <h1 style={{ 
                                    margin: '0 0 2px 0',
                                    fontSize: '16pt', 
                                    fontWeight: '600',
                                    color: '#1a1a1a',
                                    letterSpacing: '-0.3px'
                                }}>
                                    Customer Request Form
                                </h1>
                                <p style={{
                                    margin: '0',
                                    fontSize: '7.5pt',
                                    color: '#666666',
                                    fontWeight: '400'
                                }}>
                                    Hospital Sultan Idris Shah Serdang
                                </p>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{
                                backgroundColor: '#eff6ff',
                                border: '1.5px solid #2563eb',
                                padding: '6px 10px',
                                borderRadius: '4px'
                            }}>
                                <div style={{ 
                                    fontSize: '7pt', 
                                    color: '#666666',
                                    marginBottom: '1px',
                                    fontWeight: '500'
                                }}>
                                    CRF Number
                                </div>
                                <div style={{ 
                                    fontSize: '10pt', 
                                    fontWeight: '700',
                                    color: '#2563eb',
                                    letterSpacing: '0.3px'
                                }}>
                                    {crf.crf_number}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Requestor Information */}
                    <div className="section-break" style={{ marginBottom: '10px' }}>
                        <h2 style={{ 
                            fontSize: '9pt', 
                            fontWeight: '600', 
                            color: '#1a1a1a',
                            marginBottom: '6px',
                            paddingBottom: '4px',
                            borderBottom: '1.5px solid #e5e7eb'
                        }}>
                            1. REQUESTOR INFORMATION
                        </h2>
                        
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            marginBottom: '0'
                        }}>
                            <tbody>
                                <tr>
                                    <td style={{ 
                                        width: '20%',
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Full Name
                                    </td>
                                    <td style={{ 
                                        width: '30%',
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.fname}
                                    </td>
                                    <td style={{ 
                                        width: '20%',
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        NRIC
                                    </td>
                                    <td style={{ 
                                        width: '30%',
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.nric}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Department
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.department.dname}
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Designation
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.designation}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Contact Number
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.extno}
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Request Date
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {formatDateShort(crf.created_at)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Section 2: Request Details */}
                    <div className="section-break" style={{ marginBottom: '10px' }}>
                        <h2 style={{ 
                            fontSize: '9pt', 
                            fontWeight: '600', 
                            color: '#1a1a1a',
                            marginBottom: '6px',
                            paddingBottom: '4px',
                            borderBottom: '1.5px solid #e5e7eb'
                        }}>
                            2. REQUEST DETAILS
                        </h2>
                        
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            marginBottom: '6px'
                        }}>
                            <tbody>
                                <tr>
                                    <td style={{ 
                                        width: '20%',
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb',
                                        verticalAlign: 'top'
                                    }}>
                                        Category
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.category.cname}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb',
                                        verticalAlign: 'top'
                                    }}>
                                        Factor
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.factor?.name || 'Not Specified'}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb',
                                        verticalAlign: 'top'
                                    }}>
                                        Issue
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.4'
                                    }}>
                                        {crf.issue}
                                    </td>
                                </tr>
                                <tr>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb',
                                        verticalAlign: 'top'
                                    }}>
                                        Justification
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt',
                                        whiteSpace: 'pre-wrap',
                                        lineHeight: '1.4'
                                    }}>
                                        {crf.reason || 'Not Provided'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {/* Rejection/Redirect Notices */}
                        {crf.rejection_reason && (
                            <div style={{ 
                                backgroundColor: '#fef2f2', 
                                border: '1px solid #fca5a5',
                                borderLeft: '3px solid #dc2626',
                                padding: '6px 8px', 
                                marginBottom: '6px',
                                borderRadius: '3px'
                            }}>
                                <div style={{ 
                                    fontWeight: '600', 
                                    color: '#991b1b',
                                    marginBottom: '3px',
                                    fontSize: '7.5pt'
                                }}>
                                    ⚠ REJECTION NOTICE
                                </div>
                                <div style={{ color: '#7f1d1d', fontSize: '7.5pt', lineHeight: '1.3' }}>
                                    {crf.rejection_reason}
                                </div>
                            </div>
                        )}

                        {crf.redirect_reason && (
                            <div style={{ 
                                backgroundColor: '#fefce8', 
                                border: '1px solid #fde047',
                                borderLeft: '3px solid #eab308',
                                padding: '6px 8px', 
                                marginBottom: '6px',
                                borderRadius: '3px'
                            }}>
                                <div style={{ 
                                    fontWeight: '600', 
                                    color: '#854d0e',
                                    marginBottom: '3px',
                                    fontSize: '7.5pt'
                                }}>
                                    ℹ REDIRECT NOTICE
                                </div>
                                <div style={{ color: '#713f12', fontSize: '7.5pt', lineHeight: '1.3' }}>
                                    {crf.redirect_reason}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 3: Approval Chain */}
                    <div className="section-break" style={{ marginBottom: '10px' }}>
                        <h2 style={{ 
                            fontSize: '9pt', 
                            fontWeight: '600', 
                            color: '#1a1a1a',
                            marginBottom: '6px',
                            paddingBottom: '4px',
                            borderBottom: '1.5px solid #e5e7eb'
                        }}>
                            3. APPROVAL CHAIN
                        </h2>
                        
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse',
                            border: '1px solid #d1d5db'
                        }}>
                            <thead>
                                <tr style={{ backgroundColor: '#2563eb' }}>
                                    <th style={{ 
                                        padding: '6px 8px',
                                        textAlign: 'left',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '7.5pt',
                                        borderRight: '1px solid #3b82f6'
                                    }}>
                                        Approval Level
                                    </th>
                                    <th style={{ 
                                        padding: '6px 8px',
                                        textAlign: 'left',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '7.5pt',
                                        borderRight: '1px solid #3b82f6'
                                    }}>
                                        Approver Name
                                    </th>
                                    <th style={{ 
                                        padding: '6px 8px',
                                        textAlign: 'left',
                                        color: '#ffffff',
                                        fontWeight: '600',
                                        fontSize: '7.5pt'
                                    }}>
                                        Approval Date & Time
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ backgroundColor: '#ffffff' }}>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontWeight: '600',
                                        fontSize: '7.5pt',
                                        color: '#374151'
                                    }}>
                                        Head of Unit (HOU)
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.approver?.name || 'Pending'}
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '7.5pt',
                                        color: '#6b7280'
                                    }}>
                                        {crf.approved_by_hou_at ? formatDate(crf.approved_by_hou_at) : 'Pending'}
                                    </td>
                                </tr>
                                <tr style={{ backgroundColor: '#f9fafb' }}>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontWeight: '600',
                                        fontSize: '7.5pt',
                                        color: '#374151'
                                    }}>
                                        Timbalan Pengarah (TP)
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.tp_approver?.name || 'Pending'}
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '7.5pt',
                                        color: '#6b7280'
                                    }}>
                                        {crf.approved_by_tp_at ? formatDate(crf.approved_by_tp_at) : 'Pending'}
                                    </td>
                                </tr>
                                <tr style={{ backgroundColor: '#ffffff' }}>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontWeight: '600',
                                        fontSize: '7.5pt',
                                        color: '#374151'
                                    }}>
                                        IT Head of Unit
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        borderRight: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.it_hou_approver?.name || 'Pending'}
                                    </td>
                                    <td style={{ 
                                        padding: '6px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '7.5pt',
                                        color: '#6b7280'
                                    }}>
                                        {crf.it_hou_approved_at ? formatDate(crf.it_hou_approved_at) : 'Pending'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Section 4: Processing Information */}
                    <div className="section-break" style={{ marginBottom: '10px' }}>
                        <h2 style={{ 
                            fontSize: '9pt', 
                            fontWeight: '600', 
                            color: '#1a1a1a',
                            marginBottom: '6px',
                            paddingBottom: '4px',
                            borderBottom: '1.5px solid #e5e7eb'
                        }}>
                            4. PROCESSING INFORMATION
                        </h2>
                        
                        <table style={{ 
                            width: '100%', 
                            borderCollapse: 'collapse'
                        }}>
                            <tbody>
                                <tr>
                                    <td style={{ 
                                        width: '25%',
                                        padding: '5px 8px',
                                        backgroundColor: '#f9fafb',
                                        fontWeight: '600',
                                        color: '#374151',
                                        fontSize: '7.5pt',
                                        borderBottom: '1px solid #e5e7eb'
                                    }}>
                                        Assigned To
                                    </td>
                                    <td style={{ 
                                        padding: '5px 8px',
                                        borderBottom: '1px solid #e5e7eb',
                                        fontSize: '8pt'
                                    }}>
                                        {crf.assigned_user?.name || 'Unassigned'}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        {crf.it_remark && (
                            <div style={{ marginTop: '6px' }}>
                                <div style={{ 
                                    padding: '5px 8px',
                                    backgroundColor: '#f9fafb',
                                    fontWeight: '600',
                                    color: '#374151',
                                    fontSize: '7.5pt',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    IT Department Remarks
                                </div>
                                <div style={{ 
                                    padding: '6px 8px',
                                    backgroundColor: '#ffffff',
                                    border: '1px solid #e5e7eb',
                                    borderTop: 'none',
                                    fontSize: '8pt',
                                    whiteSpace: 'pre-wrap',
                                    lineHeight: '1.4',
                                    color: '#374151'
                                }}>
                                    {crf.it_remark}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 5: Status Timeline */}
                    {statusTimeline.length > 0 && (
                        <div className="section-break" style={{ marginBottom: '10px' }}>
                            <h2 style={{ 
                                fontSize: '9pt', 
                                fontWeight: '600', 
                                color: '#1a1a1a',
                                marginBottom: '6px',
                                paddingBottom: '4px',
                                borderBottom: '1.5px solid #e5e7eb'
                            }}>
                                5. STATUS TIMELINE
                            </h2>
                            
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                border: '1px solid #d1d5db'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f3f4f6' }}>
                                        <th style={{ 
                                            padding: '5px 6px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            fontSize: '7.5pt',
                                            color: '#374151',
                                            borderRight: '1px solid #d1d5db',
                                            width: '4%'
                                        }}>
                                            #
                                        </th>
                                        <th style={{ 
                                            padding: '5px 6px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            fontSize: '7.5pt',
                                            color: '#374151',
                                            borderRight: '1px solid #d1d5db',
                                            width: '38%'
                                        }}>
                                            Status / Remark
                                        </th>
                                        <th style={{ 
                                            padding: '5px 6px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            fontSize: '7.5pt',
                                            color: '#374151',
                                            borderRight: '1px solid #d1d5db',
                                            width: '28%'
                                        }}>
                                            Action By
                                        </th>
                                        <th style={{ 
                                            padding: '5px 6px',
                                            textAlign: 'left',
                                            fontWeight: '600',
                                            fontSize: '7.5pt',
                                            color: '#374151',
                                            width: '30%'
                                        }}>
                                            Date & Time
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statusTimeline.map((timeline, index) => (
                                        <tr key={timeline.id} style={{ 
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                                        }}>
                                            <td style={{ 
                                                padding: '5px 6px',
                                                borderBottom: '1px solid #e5e7eb',
                                                borderRight: '1px solid #e5e7eb',
                                                fontSize: '7.5pt',
                                                color: '#6b7280'
                                            }}>
                                                {index + 1}
                                            </td>
                                            <td style={{ 
                                                padding: '5px 6px',
                                                borderBottom: '1px solid #e5e7eb',
                                                borderRight: '1px solid #e5e7eb',
                                                fontSize: '8pt'
                                            }}>
                                                <div style={{ fontWeight: '600', marginBottom: '2px', color: '#1a1a1a' }}>
                                                    {timeline.status}
                                                </div>
                                                {timeline.remark && (
                                                    <div style={{ 
                                                        fontSize: '7.5pt',
                                                        color: '#6b7280',
                                                        fontStyle: 'italic',
                                                        whiteSpace: 'pre-wrap',
                                                        lineHeight: '1.3'
                                                    }}>
                                                        {timeline.remark}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ 
                                                padding: '5px 6px',
                                                borderBottom: '1px solid #e5e7eb',
                                                borderRight: '1px solid #e5e7eb',
                                                fontSize: '8pt'
                                            }}>
                                                {timeline.action_by}
                                            </td>
                                            <td style={{ 
                                                padding: '5px 6px',
                                                borderBottom: '1px solid #e5e7eb',
                                                fontSize: '7.5pt',
                                                color: '#6b7280'
                                            }}>
                                                {new Date(timeline.created_at).toLocaleString('en-MY', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Document Footer */}
                    <div style={{ 
                        marginTop: '12px',
                        paddingTop: '8px',
                        borderTop: '1.5px solid #e5e7eb',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div style={{ fontSize: '7pt', color: '#9ca3af' }}>
                            <div>
                                <strong>Generated:</strong> {new Date().toLocaleString('en-MY', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        <div style={{ 
                            fontSize: '7pt', 
                            color: '#9ca3af',
                            textAlign: 'right'
                        }}>
                            <div style={{ fontWeight: '600' }}>CONFIDENTIAL DOCUMENT</div>
                            <div>For Internal Use Only</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};