import { notifications } from "@mantine/notifications"
import { useState } from "react"
import { 
  TextInput, 
  Select, 
  Button, 
  Paper, 
  Stack, 
  Title, 
  Textarea,
  Group,
  LoadingOverlay,
  Modal
} from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagicWandSparkles, faCopy } from '@fortawesome/free-solid-svg-icons'

export default function AIContentGeneratorModal({ opened, onClose }) {
    const [loading, setLoading] = useState(false)
    const [contentType, setContentType] = useState('product-description')
    const [prompt, setPrompt] = useState('')
    const [generatedContent, setGeneratedContent] = useState('')

    const generateContent = async () => {
        setLoading(true)

        try {
            await new Promise(resolve => setTimeout(resolve, 2000))
            setGeneratedContent('Temporary content here for now.')
        }
        catch (error) {
            notifications.show({
                title: 'Error',
                message: error.response?.data?.message || 'An unexpected error occurred',
                color: 'red',
            })
        }
        finally {
            setLoading(false)
        }
    }

    const copyContent = () => {
        navigator.clipboard.writeText(generatedContent)
        notifications.show({
            title: 'Success',
            message: 'Content copied to clipboard',
            color: 'green'
        })
    }

    return (
        <Modal 
            opened={opened} 
            onClose={onClose}
            title="AI Content Generator"
            size="lg"
            radius="md"
            styles={{
                content: {
                    borderRadius: 'var(--mantine-radius-md)'
                }
            }}
        >
            <Stack spacing="lg">
                <form onSubmit={(e) => { e.preventDefault(); generateContent() }}>
                    <Stack spacing="md">
                        <Select
                            label="Content Type"
                            placeholder="Select content type"
                            value={contentType}
                            onChange={setContentType}
                            data={[
                                { value: 'product-description', label: 'Product Description' },
                                { value: 'seo-content', label: 'SEO Content' },
                                { value: 'product-features', label: 'Product Features' }
                            ]}
                            required
                        />
                        
                        <TextInput
                            label="Prompt"
                            placeholder="Enter your prompt here"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            required
                        />

                        <Button 
                            type="submit"
                            loading={loading}
                            fullWidth
                        >
                            <Group spacing="xs">
                                <FontAwesomeIcon icon={faMagicWandSparkles} />
                                <span>Generate Content</span>
                            </Group>
                        </Button>
                    </Stack>
                </form>

                {generatedContent && (
                    <Paper withBorder p="md" pos="relative">
                        <LoadingOverlay 
                            visible={loading} 
                            blur={2}
                        />
                        <Stack spacing="md">
                            <Textarea
                                value={generatedContent}
                                readOnly
                                minRows={4}
                                autosize
                                styles={{ input: { cursor: 'default' } }}
                            />
                            <Group position="right">
                                <Button 
                                    onClick={copyContent}
                                    variant="light"
                                >
                                    <Group spacing="xs">
                                        <FontAwesomeIcon icon={faCopy} />
                                        <span>Copy to Clipboard</span>
                                    </Group>
                                </Button>
                            </Group>
                        </Stack>
                    </Paper>
                )}
            </Stack>
        </Modal>
    )
}