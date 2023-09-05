YEAR = $(shell date +"%Y")
define LICENSE
      MIT License

      Copyright (c) $(YEAR) Sony Pictures Entertainment.

      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
endef
export LICENSE

default:
	@echo Generating new Cloudformation templates...
	@cdk list | while IFS= read -r template; do \
		echo '---' > templates/$$template.yaml && \
		echo 'AWSTemplateFormatVersion: 2010-09-09' >> templates/$$template.yaml && \
		echo "Description: Example DMSC template: $$template" >> templates/$$template.yaml && \
		echo 'Metadata:' >> templates/$$template.yaml && \
		echo '  License:' >> templates/$$template.yaml && \
		echo '    Description: |' >> templates/$$template.yaml && \
		echo "$$LICENSE" >> templates/$$template.yaml && \
		cdk synth "$$template" >> templates/$$template.yaml; \
	done
	@echo Done!
