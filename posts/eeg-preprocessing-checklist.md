# A minimal EEG preprocessing checklist

The steps I run before touching any analysis. Nothing fancy — just the order that
keeps me from chasing artifacts later.

## The checklist

1. **Read raw + set montage.** Confirm channel names match your cap.
2. **Filter.** High-pass at 1 Hz, low-pass at 40 Hz for most resting-state work.
3. **Mark bad channels.** Visual pass first, then automated.
4. **Re-reference.** Average reference unless you have a reason not to.
5. **ICA.** Fit, label components, remove eye and muscle.
6. **Epoch and inspect.** Drop what's left.

```python
raw.set_montage("standard_1020")
raw.filter(1, 40)
ica = mne.preprocessing.ICA(n_components=20).fit(raw)
```

> Write down the parameters. Future-you will not remember them.

Replace this with your real notes whenever you're ready.
