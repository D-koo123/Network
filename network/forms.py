from django import forms
from network.models import Post


class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["post"]
        widgets = {
            'post': forms.Textarea(attrs={'rows': 5, 'cols': 180, 'placeholder': "Whats on your mind......", 'class': 'custom-textarea','autofocus': 'autofocus'})
        }
        