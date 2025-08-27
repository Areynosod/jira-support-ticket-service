import { FC } from 'hono/jsx';
import { Input } from '../ui/input-text';
import { TextArea } from '../ui/textarea-input';
import { Select } from '../ui/select';
import { FeedbackType } from '@/schema/feedback-schema';

type FeedbackFormProps = {
	data: FeedbackType | null;
	errors: string[] | null;
	project: string;
};

export const FeedbackForm: FC<FeedbackFormProps> = ({
	data,
	errors,
	project
}) => {
	const errorFullname = errors?.includes('Full name is required');
	const errorEmail = errors?.includes('Invalid email');
	const errorType = errors?.includes('Type is required');
	const errorDescription = errors?.includes('Description is required');

	return (
		<form
			hx-post={`/${project}`}
			hx-target="this"
			hx-swap="outerHTML"
			className="w-full max-w-md mx-auto bg-gray-100 rounded-none sm:rounded-md m-4">
			<div className="bg-blue-500 rounded-t-md py-4">
				<h1 className="text-2xl font-extralight text-center text-white">
					Support Form
				</h1>
			</div>

			<div className="p-4">
				<Input
					label="Name"
					name="full_name"
					value={data?.full_name || ''}
					placeholder="Full name"
					type="text"
					error={errorFullname}
				/>

				<Input
					label="Email"
					name="email"
					placeholder="example@gmail.com"
					type="email"
					value={data?.email || ''}
					error={errorEmail}
				/>

				<Select
					label="Type"
					name="type"
					options={['Question', 'Feature Request', 'Bug', 'Feedback']}
					error={errorType}
				/>

				<TextArea
					label="Description"
					name="description"
					placeholder="Description"
					type="text"
					error={errorDescription}
				/>

				{errors && errors.length > 0 && (
					<div className="p-2 rounded-md bg-red-100">
						{errors.map((error) => (
							<p key={error}>
								<span className="error-color">*</span> {error}
							</p>
						))}
					</div>
				)}
				<div className="flex justify-center py-2">
					<div id="turnstile-widget"></div>
				</div>

				<div className="flex justify-center py-2">
					<button type="submit" className="btn btn-primary">
						Send Feedback
					</button>
				</div>
			</div>

			<script
				dangerouslySetInnerHTML={{
					__html: `
            function initializeTurnstile() {
              if (typeof turnstile !== 'undefined') {
                const existingWidget = document.getElementById('turnstile-widget');
                if (existingWidget && existingWidget.children.length > 0) {
                  try {
                    turnstile.reset();
                  } catch (e) {
                    console.log('Turnstile reset failed, rendering new widget');
                    existingWidget.innerHTML = '';
                    turnstile.render('#turnstile-widget', {
                      sitekey: '${process.env.CF_TURNSTILE_SITE_KEY}',
                      theme: 'light'
                    });
                  }
                } else {
                  turnstile.render('#turnstile-widget', {
                    sitekey: '${process.env.CF_TURNSTILE_SITE_KEY}',
                    theme: 'light'
                  });
                }
              } else {
                setTimeout(initializeTurnstile, 100);
              }
            }
            
           
            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', initializeTurnstile);
            } else {
              initializeTurnstile();
            }
          `
				}}
			/>
		</form>
	);
};
