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
        // Set document title for PDF filename
        const originalTitle = document.title;
        document.title = `CRF - ${crf.crf_number}`;
        
        window.print();
        
        // Restore original title after print dialog
        setTimeout(() => {
            document.title = originalTitle;
        }, 1000);
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
                    padding: '8px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    backgroundColor: '#ffffff',
                    color: '#000000',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                    e.currentTarget.style.borderColor = '#9ca3af';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#d1d5db';
                }}
            >
                <FileDown style={{ width: '16px', height: '16px' }} />
                Save as PDF
            </button>

            {/* Hidden content for printing */}
            <div ref={printRef} className="print-content">
                <style>{`
                    @media print {
                        /* Hide everything except print content */
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
                            max-height: 100vh;
                            overflow: hidden;
                        }
                        
                        /* Page setup - fit to one page */
                        @page {
                            size: A4;
                            margin: 8mm;
                        }
                        
                        /* Reset all inherited styles */
                        .print-content * {
                            all: revert;
                            font-family: Arial, sans-serif;
                        }
                        
                        /* Prevent page breaks */
                        .print-content {
                            page-break-inside: avoid;
                            page-break-after: avoid;
                        }
                        
                        .print-content table {
                            page-break-inside: avoid;
                        }
                        
                        .print-content div {
                            page-break-inside: avoid;
                        }
                    }
                    
                    @media screen {
                        .print-content {
                            display: none;
                        }
                    }
                `}</style>

                {/* Print-only content */}
                <div style={{
                    padding: '10px',
                    fontFamily: 'Arial, sans-serif',
                    fontSize: '9px',
                    lineHeight: '1.2',
                    color: '#000000',
                }}>
                    {/* Header */}
                    <div style={{ 
                        textAlign: 'center', 
                        borderBottom: '1px solid #333333', 
                        paddingBottom: '8px', 
                        marginBottom: '10px' 
                    }}>
                        <h1 style={{ 
                            margin: '0 0 3px 0', 
                            fontSize: '20px', 
                            fontWeight: 'bold',
                            color: '#333333' 
                        }}>
                            Customer Request Form (CRF)
                        </h1>
                        <p style={{ color: '#333333', fontSize: '12px', margin: 0 }}>
                            CRF No: {crf.crf_number}
                        </p>
                    </div>

                    {/* Basic Information - 2 columns */}
                    <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', width: '50%', fontSize: '12px' }}>
                                    <strong>Name:</strong> {crf.fname}
                                </td>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', width: '50%', fontSize: '12px' }}>
                                    <strong>NRIC:</strong> {crf.nric}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Department:</strong> {crf.department.dname}
                                </td>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Designation:</strong> {crf.designation}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Ext & HP No:</strong> {crf.extno}
                                </td>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Category:</strong> {crf.category.cname}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Factor:</strong> {crf.factor?.name || '-'}
                                </td>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', fontSize: '12px' }}>
                                    <strong>Status:</strong> {crf.application_status.status}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Issue and Reason */}
                    <div style={{ marginBottom: '10px', fontSize: '12px' }}>
                        <div style={{ marginBottom: '6px' }}>
                            <strong>Issue:</strong>
                            <div style={{ marginTop: '2px', whiteSpace: 'pre-wrap' }}>{crf.issue}</div>
                        </div>
                        <div>
                            <strong>Reason:</strong>
                            <div style={{ marginTop: '2px', whiteSpace: 'pre-wrap' }}>{crf.reason || '-'}</div>
                        </div>
                    </div>

                    {/* Rejection/Redirect Info */}
                    {crf.rejection_reason && (
                        <div style={{ 
                            backgroundColor: '#ffeeee', 
                            padding: '6px', 
                            marginBottom: '10px',
                            border: '1px solid #ffcccc',
                            fontSize: '12px'
                        }}>
                            <strong style={{ color: '#cc0000' }}>Rejection Reason:</strong>
                            <div style={{ marginTop: '2px', color: '#cc0000' }}>{crf.rejection_reason}</div>
                        </div>
                    )}

                    {crf.redirect_reason && (
                        <div style={{ 
                            backgroundColor: '#ffffcc', 
                            padding: '6px', 
                            marginBottom: '10px',
                            border: '1px solid #ffcc00',
                            fontSize: '12px'
                        }}>
                            <strong style={{ color: '#3f3f00' }}>Redirect Reason:</strong>
                            <div style={{ marginTop: '2px', color: '#3f3f00' }}>{crf.redirect_reason}</div>
                        </div>
                    )}

                    {/* Approvals */}
                    <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse', fontSize: '12px' }}>
                        <tbody>
                            <tr>
                                <td style={{ width: '33.33%', padding: '5px', border: '1px solid #dddddd', backgroundColor: '#f9fafb', verticalAlign: 'top' }}>
                                    <strong style={{ display: 'block', marginBottom: '4px' }}>HOU Approval</strong>
                                    <div>
                                        <div><strong>By:</strong> {crf.approver?.name || 'N/A'}</div>
                                        <div><strong>At:</strong> {crf.approved_by_hou_at 
                                            ? new Date(crf.approved_by_hou_at + 'Z').toLocaleString('en-MY', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ width: '33.33%', padding: '5px', border: '1px solid #dddddd', backgroundColor: '#f9fafb', verticalAlign: 'top' }}>
                                    <strong style={{ display: 'block', marginBottom: '4px' }}>TP Approval</strong>
                                    <div>
                                        <div><strong>By:</strong> {crf.tp_approver?.name || 'N/A'}</div>
                                        <div><strong>At:</strong> {crf.approved_by_tp_at 
                                            ? new Date(crf.approved_by_tp_at + 'Z').toLocaleString('en-MY', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'N/A'}
                                        </div>
                                    </div>
                                </td>
                                <td style={{ width: '33.33%', padding: '5px', border: '1px solid #dddddd', backgroundColor: '#f9fafb', verticalAlign: 'top' }}>
                                    <strong style={{ display: 'block', marginBottom: '4px' }}>IT HOU Approval</strong>
                                    <div>
                                        <div><strong>By:</strong> {crf.it_hou_approver?.name || 'N/A'}</div>
                                        <div><strong>At:</strong> {crf.it_hou_approved_at 
                                            ? new Date(crf.it_hou_approved_at + 'Z').toLocaleString('en-MY', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })
                                            : 'N/A'}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Additional Info */}
                    <table style={{ width: '100%', marginBottom: '10px', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', width: '50%', fontSize: '12px' }}>
                                    <strong>Assigned To:</strong> {crf.assigned_user?.name || '-'}
                                </td>
                                <td style={{ padding: '3px 0', borderBottom: '1px solid #e5e7eb', width: '50%', fontSize: '12px' }}>
                                    <strong>Created:</strong> {new Date(crf.created_at).toLocaleString('en-MY', { 
                                        day: 'numeric', 
                                        month: 'short', 
                                        year: 'numeric' 
                                    })}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* IT Remark */}
                    {crf.it_remark && (
                        <div style={{ marginBottom: '10px', fontSize: '12px'}}>
                            <strong>IT Remark:</strong>
                            <div style={{ 
                                marginTop: '2px',
                                padding: '5px', 
                                backgroundColor: '#f5f5f5',
                                border: '1px solid #dddddd',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {crf.it_remark}
                            </div>
                        </div>
                    )}

                    {/* Status Timeline */}
                    {statusTimeline.length > 0 && (
                        <div style={{ marginBottom: '12px' }}>
                            <h3 style={{ 
                                fontSize: '12px', 
                                fontWeight: 'bold', 
                                marginBottom: '5px',
                                borderBottom: '1px solid #dddddd',
                                paddingBottom: '3px'
                            }}>
                                Status Timeline
                            </h3>
                            <table style={{ 
                                width: '100%', 
                                borderCollapse: 'collapse',
                                fontSize: '12px'
                            }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#70a7ee', color: '#1c1c1c' }}>
                                        <th style={{ padding: '4px', textAlign: 'left', width: '4%' }}>No.</th>
                                        <th style={{ padding: '4px', textAlign: 'left', width: '38%' }}>Status</th>
                                        <th style={{ padding: '4px', textAlign: 'left', width: '28%' }}>Action By</th>
                                        <th style={{ padding: '4px', textAlign: 'left', width: '30%' }}>Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statusTimeline.map((timeline, index) => (
                                        <tr key={timeline.id} style={{ 
                                            backgroundColor: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                                            borderBottom: '1px solid #dddddd'
                                        }}>
                                            <td style={{ padding: '4px' }}>{index + 1}</td>
                                            <td style={{ padding: '4px' }}>
                                                <div>{timeline.status}</div>
                                                {timeline.remark && (
                                                    <div style={{ 
                                                        fontSize: '12px', 
                                                        color: '#666666', 
                                                        marginTop: '1px',
                                                        whiteSpace: 'pre-wrap'
                                                    }}>
                                                        {timeline.remark}
                                                    </div>
                                                )}
                                            </td>
                                            <td style={{ padding: '4px' }}>{timeline.action_by}</td>
                                            <td style={{ padding: '4px', fontSize: '12px' }}>
                                                {new Date(timeline.created_at).toLocaleString('en-MY', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: '2-digit',
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

                    {/* Attachments */}
                    {attachments.length > 0 && (
                        <div style={{ marginBottom: '8px' }}>
                            <h3 style={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                marginBottom: '5px',
                                borderBottom: '1px solid #dddddd',
                                paddingBottom: '3px'
                            }}>
                                Attachments
                            </h3>
                            <ul style={{ margin: 0, paddingLeft: '15px', fontSize: '12px' }}>
                                {attachments.map((attachment) => (
                                    <li key={attachment.id} style={{ marginBottom: '2px' }}>
                                        {attachment.name} ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Footer */}
                    <div style={{ 
                        marginTop: '10px', 
                        paddingTop: '6px', 
                        borderTop: '1px solid #333333',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#666666',
                    }}>
                        <div>Generated at: {new Date().toLocaleDateString('en-MY')}, {new Date().toLocaleTimeString('en-MY')}</div>
                    </div>
                </div>
            </div>
        </>
    );
};