# Create CloudFormation Stack
echo "Please enter Serverless Stack Name:"
read serverlessStackName
if [ -z "$serverlessStackName" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$serverlessStackName"

#S3 bucket lambda
echo "Please enter S3 Bucket Name for lambda:"
read s3bucketlambda
if [ -z "$s3bucketlambda" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$s3bucketlambda"

#S3 lambda zip file name
echo "Please enter S3 lambda zip file:"
read s3lambdazipfile
if [ -z "$s3lambdazipfile" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$s3lambdazipfile"

#Domain name of namecheap
echo "Please enter Domain name for mail server:"
read domainname
if [ -z "$domainname" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$domainname"

#Sender name parameter
echo "Please enter Sender Name for mail:"
read sendername
if [ -z "$sendername" ]
then
	echo "StackName error exiting!"
	exit 1
fi
echo "$sendername"

echo "Validating template"
TMP_code=`aws cloudformation validate-template --template-body file://./csye6225-cf-serverless.json`
if [ -z "$TMP_code" ]
then
	echo "Template error exiting!"
	exit 1
fi
echo "Cloudformation template validation success"

echo "Creating Serverless CloudFormation Stack"

CRTSTACK_Code=`aws cloudformation create-stack --stack-name $serverlessStackName --template-body file://./csye6225-cf-serverless.json  --parameters ParameterKey=LambdaS3BucketParameter,ParameterValue=$s3bucketlambda  ParameterKey=LambdaS3ZipFileParameter,ParameterValue=$s3lambdazipfile ParameterKey=DomainNameParameter,ParameterValue=$domainname ParameterKey=SenderNameParameter,ParameterValue=$sendername --capabilities CAPABILITY_NAMED_IAM`
if [ -z "$CRTSTACK_Code" ]
then
	echo "Stack Creation error exiting!"
	exit 1
fi
aws cloudformation wait stack-create-complete --stack-name $serverlessStackName
echo "Serverless Stack Created"
echo "Check AWS Cloudformation"
