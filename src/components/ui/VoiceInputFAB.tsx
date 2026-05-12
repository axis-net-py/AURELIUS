import React, { useRef, useState, useEffect } from 'react';
import { Mic, Sparkles, MessageSquare, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export const VoiceInputFAB: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isInputMode, setIsInputMode] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const successSound = new Audio('/sounds/success.mp3');

  const triggerHaptic = (pattern: number | number[]) => {
    if (window.navigator.vibrate) window.navigator.vibrate(pattern);
  };

  const startRecording = async () => {
    try {
      triggerHaptic(50);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunks.current = [];

      mediaRecorder.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.onstop = sendAudio;
      
      mediaRecorder.start();
      setIsRecording(true);
      toast("Gravando...", { icon: "🎙️" });
    } catch (err) {
      toast.error("Erro ao acessar o microfone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      triggerHaptic(100);
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const sendAudio = async () => {
    const blob = new Blob(chunks.current, { type: 'audio/ogg' });
    const formData = new FormData();
    formData.append('audio', blob);

    try {
      const response = await fetch('/api/process-voice-input', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      successSound.play().catch(() => {});
      toast.success(`Entendido: ${data.message || 'Dados registrados com sucesso.'}`);
    } catch {
      toast.error("Erro ao processar áudio.");
    }
  };

  return (
    <>
      <button
        onMouseDown={startRecording}
        onMouseUp={stopRecording}
        onTouchStart={startRecording}
        onTouchEnd={stopRecording}
        onClick={() => !isRecording && setIsInputMode(true)}
        className={cn(
          "fixed bottom-20 right-6 z-50 h-14 w-14 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center",
          isRecording 
            ? "bg-[#C19A6B] ring-4 ring-[#C19A6B]/50" 
            : "bg-[#1B4332] hover:bg-[#1B4332]/90"
        )}
      >
        <div className={cn("relative flex items-center justify-center", isRecording && "animate-[ping_1.5s_ease-in-out_infinite]")}>
           {isRecording ? <Activity className="text-white" /> : <Sparkles className="text-white" />}
        </div>
      </button>

      {isInputMode && (
        <div className="fixed bottom-40 right-6 bg-card p-4 rounded-xl border shadow-lg z-50">
           <input className="border rounded p-2" placeholder="Digite..." onKeyDown={(e) => { if(e.key === 'Enter') setIsInputMode(false); }} />
        </div>
      )}
    </>
  );
};
