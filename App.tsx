
import React, { useState } from 'react';
import { ActivityPlan } from './types';
import { SUBJECT_ORDER } from './constants';
import { generatePlan, extendPlan } from './services/geminiService';

const Spinner: React.FC = () => (
    <div className="border-4 border-white/20 border-l-[#FF77B7] rounded-full w-6 h-6 animate-spin"></div>
);

interface OutputFieldProps {
    label: string;
    id: string;
    content: string;
    isTagField?: boolean;
    onContentChange: (newContent: string) => void;
}

const OutputField: React.FC<OutputFieldProps> = ({ label, id, content, isTagField = false, onContentChange }) => {
    const [copyText, setCopyText] = useState('Copy');

    const handleCopy = async () => {
        if (!navigator.clipboard) {
            setCopyText('Failed');
            setTimeout(() => setCopyText('Copy'), 2000);
            return;
        }
        try {
            await navigator.clipboard.writeText(content);
            setCopyText('Copied!');
            setTimeout(() => setCopyText('Copy'), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopyText('Failed');
            setTimeout(() => setCopyText('Copy'), 2000);
        }
    };

    const lineCount = (content.match(/\n/g) || []).length + 1;
    let rows;
    if (isTagField) {
        rows = Math.max(3, Math.min(8, lineCount + 1));
    } else if (id.includes('title') || id.includes('subtitle') || id.includes('learner')) {
        rows = Math.max(2, Math.min(5, Math.ceil(content.length / 50)));
    } else {
        rows = Math.max(5, Math.min(15, lineCount + 2));
    }

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-white mb-1">{label}</label>
            <div className="flex items-start space-x-2">
                <textarea 
                    id={id} 
                    rows={rows} 
                    value={content}
                    onChange={(e) => onContentChange(e.target.value)}
                    className="flex-1 w-full p-3 border border-slate-200 rounded-lg shadow-sm bg-white text-[#A459D1] focus:border-[#3f83f8] focus:ring-2 focus:ring-[#3f83f8]/30"
                    style={{ whiteSpace: isTagField ? 'pre-wrap' : 'pre-wrap' }}
                />
                {!isTagField && (
                     <button 
                        onClick={handleCopy}
                        className={`px-3 py-2 text-sm font-semibold rounded-md shadow-sm transition-colors duration-200 ${copyText === 'Copied!' ? 'bg-[#38a169] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                        title="Copy to clipboard"
                    >
                        {copyText}
                    </button>
                )}
            </div>
        </div>
    );
};

const App: React.FC = () => {
    const [facilitatorName, setFacilitatorName] = useState('');
    const [learnerName, setLearnerName] = useState('');
    const [activityDescription, setActivityDescription] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [isExtending, setIsExtending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [generatedPlan, setGeneratedPlan] = useState<ActivityPlan | null>(null);
    const [originalPlan, setOriginalPlan] = useState<ActivityPlan | null>(null);
    const [originalContext, setOriginalContext] = useState<{ personalizationContext: string, learningOutcomesReference: string, themesReference: string } | null>(null);

    const handleGenerate = async () => {
        if (!activityDescription.trim()) {
            setError("Please enter an activity description first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedPlan(null);
        setOriginalPlan(null);

        try {
            const { plan, context } = await generatePlan(facilitatorName, learnerName, activityDescription, SUBJECT_ORDER);
            setGeneratedPlan(plan);
            setOriginalPlan(plan);
            setOriginalContext(context);
        } catch (err) {
            console.error("Error generating plan:", err);
            setError(err instanceof Error ? `Failed to generate plan: ${err.message}` : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleExtend = async () => {
        if (!generatedPlan || !originalContext) {
            setError("Cannot extend without an initial plan.");
            return;
        }

        setIsExtending(true);
        setError(null);

        try {
            const newPlan = await extendPlan(generatedPlan, originalContext);
            setGeneratedPlan(newPlan);
        } catch (err) {
            console.error("Error extending plan:", err);
            setError(err instanceof Error ? `Failed to extend plan: ${err.message}` : 'An unknown error occurred.');
        } finally {
            setIsExtending(false);
        }
    };

    const handleRevert = () => {
        setGeneratedPlan(originalPlan);
    };
    
    const handlePlanChange = <K extends keyof ActivityPlan,>(field: K, value: ActivityPlan[K]) => {
        setGeneratedPlan(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleOutcomeCodesChange = (subject: string, value: string) => {
        const codes = value.split('\n').map(s => s.replace(/•\s*/, '').trim()).filter(Boolean);
        setGeneratedPlan(prev => {
            if (!prev) return null;
            const newOutcomeCodes = { ...prev.outcomeCodes, [subject]: codes };
            return { ...prev, outcomeCodes: newOutcomeCodes };
        });
    };

    const isExtended = originalPlan && generatedPlan && JSON.stringify(originalPlan) !== JSON.stringify(generatedPlan);

    return (
        <div className="p-4 md:p-6 bg-white min-h-screen">
            <div className="max-w-3xl mx-auto bg-[#55BF3A] p-6 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-6 text-center">Activity Plan Generator</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="facilitator-name" className="block text-sm font-medium text-white mb-1">Facilitator's Name (Optional)</label>
                        <input type="text" id="facilitator-name" value={facilitatorName} onChange={e => setFacilitatorName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg shadow-sm text-[#A459D1] placeholder:text-[#FF77B7] focus:border-[#3f83f8] focus:ring-2 focus:ring-[#3f83f8]/30" placeholder="e.g., Sarah" />
                    </div>

                    <div>
                        <label htmlFor="learner-name" className="block text-sm font-medium text-white mb-1">Learner's Name (Optional)</label>
                        <input type="text" id="learner-name" value={learnerName} onChange={e => setLearnerName(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg shadow-sm text-[#A459D1] placeholder:text-[#FF77B7] focus:border-[#3f83f8] focus:ring-2 focus:ring-[#3f83f8]/30" placeholder="e.g., Tom" />
                    </div>

                    <div>
                        <label htmlFor="activity-description" className="block text-sm font-medium text-white mb-1">Brief Activity Idea/Description</label>
                        <textarea id="activity-description" rows={3} value={activityDescription} onChange={e => setActivityDescription(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg shadow-sm text-[#A459D1] placeholder:text-[#FF77B7] focus:border-[#3f83f8] focus:ring-2 focus:ring-[#3f83f8]/30" placeholder="e.g., 'A nature walk to find different coloured leaves' or 'Using blocks to learn about simple addition'"></textarea>
                    </div>
                    
                    <button onClick={handleGenerate} disabled={isLoading} className="w-full flex justify-center items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-sm bg-[#FF77B7] hover:bg-[#e66a9e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#55BF3A] focus:ring-[#FF77B7] disabled:bg-[#FF77B7]/50 disabled:cursor-not-allowed">
                        {isLoading ? <Spinner /> : null}
                        <span>{isLoading ? 'Generating...' : 'Generate Plan'}</span>
                    </button>
                </div>

                {error && <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg">{error}</div>}

                {generatedPlan && (
                    <div className="mt-8 pt-6 border-t border-white/30">
                        <h2 className="text-2xl font-semibold text-white mb-4">Generated Plan (Editable)</h2>
                        <p className="text-sm text-white/80 mb-4">You can edit the text in any box below, then use the 'Copy' button to paste it into your form fields.</p>
                        <div className="space-y-5">
                           <OutputField label="Activity Title" id="ai-title" content={generatedPlan.activityTitle} onContentChange={v => handlePlanChange('activityTitle', v)} />
                           <OutputField label="Activity Subtitle" id="ai-subtitle" content={generatedPlan.activitySubtitle} onContentChange={v => handlePlanChange('activitySubtitle', v)} />
                           <OutputField label="Activity Description" id="ai-description" content={generatedPlan.activityDescription} onContentChange={v => handlePlanChange('activityDescription', v)} />
                           <OutputField label="Learner Description (for the learner)" id="ai-learner-desc" content={generatedPlan.learnerDescription} onContentChange={v => handlePlanChange('learnerDescription', v)} />
                           <OutputField label="Resources & Materials" id="ai-resources" content={generatedPlan.resources} onContentChange={v => handlePlanChange('resources', v)} />
                           <OutputField label="Activity Plan (Facilitator)" id="ai-plan" content={generatedPlan.activityPlan} onContentChange={v => handlePlanChange('activityPlan', v)} />
                           <OutputField label="Learner Instructions" id="ai-learner-instructions" content={generatedPlan.learnerInstructions} onContentChange={v => handlePlanChange('learnerInstructions', v)} />
                           
                           <OutputField label="Suggested Learning Areas (for Tags field)" id="ai-areas" content={generatedPlan.learningAreas.map(item => `• ${item}`).join('\n')} onContentChange={v => handlePlanChange('learningAreas', v.split('\n').map(s => s.replace(/•\s*/, '').trim()).filter(Boolean))} isTagField />

                           {SUBJECT_ORDER.map(subject => {
                                if (generatedPlan.outcomeCodes[subject as keyof typeof generatedPlan.outcomeCodes]?.length) {
                                    const safeId = subject.toLowerCase().replace(/\s+/g, '-');
                                    return <OutputField key={subject} label={`Suggested Outcome Codes - ${subject}`} id={`ai-codes-${safeId}`} content={(generatedPlan.outcomeCodes[subject as keyof typeof generatedPlan.outcomeCodes] || []).map(item => `• ${item}`).join('\n')} onContentChange={(v) => handleOutcomeCodesChange(subject, v)} isTagField />
                                }
                                return null;
                           })}

                            <OutputField label="Suggested Themes (from your list)" id="ai-themes-identified" content={generatedPlan.identifiedThemes.map(item => `• ${item}`).join('\n')} onContentChange={v => handlePlanChange('identifiedThemes', v.split('\n').map(s => s.replace(/•\s*/, '').trim()).filter(Boolean))} isTagField />
                            <OutputField label="Additional Suggested Themes" id="ai-themes-suggested" content={generatedPlan.suggestedThemes.map(item => `• ${item}`).join('\n')} onContentChange={v => handlePlanChange('suggestedThemes', v.split('\n').map(s => s.replace(/•\s*/, '').trim()).filter(Boolean))} isTagField />
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row gap-4">
                            <button onClick={handleExtend} disabled={isExtending} className="w-full flex justify-center items-center gap-2 px-6 py-3 text-white font-semibold rounded-lg shadow-sm bg-[#F97316] hover:bg-[#EA580C] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#55BF3A] focus:ring-[#F97316] disabled:bg-[#F97316]/50 disabled:cursor-not-allowed">
                                {isExtending ? <Spinner /> : null}
                                <span>{isExtending ? 'Extending...' : 'Extend Activity'}</span>
                            </button>
                            {isExtended && (
                                <button onClick={handleRevert} className="w-full flex justify-center items-center px-6 py-3 text-white font-semibold rounded-lg shadow-sm bg-[#38BDF8] hover:bg-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#55BF3A] focus:ring-[#38BDF8]">
                                    Revert to Original
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
