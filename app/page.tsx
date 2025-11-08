'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [collageUrl, setCollageUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const generateCollage = async () => {
    setLoading(true)
    setError(null)
    setCollageUrl(null)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to generate collage')
      }

      const data = await response.json()
      setCollageUrl(data.imageUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Cinematic Three-Panel Portrait Collage</h1>
        <p style={styles.subtitle}>Film-style Asian woman portrait in Greek temple settings</p>

        <button
          onClick={generateCollage}
          disabled={loading}
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
        >
          {loading ? 'Generating...' : 'Generate Collage'}
        </button>

        {error && (
          <div style={styles.error}>
            Error: {error}
          </div>
        )}

        {collageUrl && (
          <div style={styles.imageContainer}>
            <img
              src={collageUrl}
              alt="Cinematic three-panel collage"
              style={styles.image}
            />
            <a
              href={collageUrl}
              download="cinematic-collage.png"
              style={styles.downloadLink}
            >
              Download Image
            </a>
          </div>
        )}
      </div>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '2rem',
  },
  container: {
    maxWidth: '800px',
    width: '100%',
    textAlign: 'center',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#9ca3af',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#f59e0b',
    color: '#1a1a1a',
    padding: '1rem 2rem',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  error: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#dc2626',
    borderRadius: '8px',
    color: '#ffffff',
  },
  imageContainer: {
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '12px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
  },
  downloadLink: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderRadius: '8px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
  },
}
