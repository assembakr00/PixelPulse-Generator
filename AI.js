const promptInput = document.getElementById('prompt');
const durationSelect = document.getElementById('duration');
const styleSelect = document.getElementById('style');
const apiUrlInput = document.getElementById('apiUrl');
const apiKeyInput = document.getElementById('apiKey');
const generateBtn = document.getElementById('generateBtn');
const resetBtn = document.getElementById('resetBtn');
const logArea = document.getElementById('logArea');
const previewVideo = document.getElementById('previewVideo');
const previewFrame = document.getElementById('previewFrame');

function setStatus(message, level = 'info') {
  logArea.textContent = message;
  logArea.dataset.level = level;
}

function showPlaceholder(message) {
  const placeholder = previewFrame.querySelector('.placeholder');
  if (message) {
    placeholder.querySelector('strong').textContent = message.title || 'Waiting for your prompt.';
    placeholder.querySelector('p').textContent = message.subtitle || 'Enter a prompt above and click Generate to start producing an AI video.';
  }
  previewVideo.hidden = true;
  previewVideo.pause();
  previewVideo.removeAttribute('src');
  placeholder.style.display = 'grid';
}

function showVideo(src) {
  const placeholder = previewFrame.querySelector('.placeholder');
  placeholder.style.display = 'none';
  previewVideo.hidden = false;
  previewVideo.src = src;
  previewVideo.load();
}

function base64ToBlob(base64, mimeType = 'video/mp4') {
  const binary = atob(base64.replace(/\s/g, ''));
  const length = binary.length;
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

function resetForm() {
  promptInput.value = '';
  durationSelect.value = '12';
  styleSelect.value = 'cinematic';
  apiUrlInput.value = '';
  apiKeyInput.value = '';
  setStatus('Ready for a new prompt.');
  showPlaceholder({ title: 'Ready to create.', subtitle: 'Enter a prompt and press Generate.' });
}

async function generateVideo() {
  const prompt = promptInput.value.trim();
  const duration = durationSelect.value;
  const style = styleSelect.value;
  const endpoint = apiUrlInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!prompt) {
    window.alert('Please enter a prompt to generate video content.');
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = 'Creating...';
  setStatus('Preparing request...', 'info');

  if (!endpoint) {
    setStatus('Demo mode: configure an AI endpoint to generate a real video.', 'warning');
    showPlaceholder({
      title: 'Demo mode active',
      subtitle: 'No endpoint provided. Paste your AI API endpoint and try again to render real video output.'
    });
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate video';
    return;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      body: JSON.stringify({
        prompt,
        duration,
        style,
        format: 'mp4',
      }),
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    setStatus('Processing response...', 'info');

    if (data.videoUrl) {
      showVideo(data.videoUrl);
      setStatus('Video generation complete. Use controls to preview playback.', 'success');
    } else if (data.videoBase64) {
      const blob = base64ToBlob(data.videoBase64, data.mimeType || 'video/mp4');
      const url = URL.createObjectURL(blob);
      showVideo(url);
      setStatus('Video generation complete. Use controls to preview playback.', 'success');
    } else {
      throw new Error('No video URL or videoBase64 found in API response.');
    }
  } catch (err) {
    setStatus(`Generation failed: ${err.message}`, 'error');
    showPlaceholder({ title: 'Unable to generate video', subtitle: 'Check your endpoint, API key, and prompt, then try again.' });
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Generate video';
  }
}

generateBtn.addEventListener('click', generateVideo);
resetBtn.addEventListener('click', resetForm);
window.addEventListener('load', () => {
  setStatus('Ready for a new prompt.');
  showPlaceholder();
});
