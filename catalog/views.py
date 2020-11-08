from django.shortcuts import render

# Create your views here.

def post_list(request):
  return render(request, 'catalog/post_list.html', {})
def home(request):
  return render(request, 'catalog/home.html', {})